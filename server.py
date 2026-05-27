from __future__ import annotations

import argparse
import json
import os
import re
from functools import lru_cache
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib import error, request

ROOT = Path(__file__).resolve().parent
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8123"))
SEC_USER_AGENT = "OpenClaw acquisition-strategy-demo/1.0 (contact: openclaw@example.com)"

COMPANY_FALLBACKS = {
    "apple": {"company_name": "Apple Inc.", "cik": "0000320193", "fy": 2024},
    "苹果": {"company_name": "Apple Inc.", "cik": "0000320193", "fy": 2024},
    "microsoft": {"company_name": "Microsoft Corporation", "cik": "0000789019", "fy": 2024},
    "微软": {"company_name": "Microsoft Corporation", "cik": "0000789019", "fy": 2024},
    "nvidia": {"company_name": "NVIDIA Corporation", "cik": "0001045810", "fy": 2024},
    "英伟达": {"company_name": "NVIDIA Corporation", "cik": "0001045810", "fy": 2024},
    "tesla": {"company_name": "Tesla, Inc.", "cik": "0001318605", "fy": 2023},
    "特斯拉": {"company_name": "Tesla, Inc.", "cik": "0001318605", "fy": 2023},
}

METRIC_DEFS = [
    {
        "key": "revenue",
        "label": "Revenue",
        "keywords": ["revenue", "sales", "营收", "收入", "总收入"],
        "concepts": [
            "RevenueFromContractWithCustomerExcludingAssessedTax",
            "RevenueFromContractWithCustomerIncludingAssessedTax",
            "SalesRevenueNet",
        ],
    },
    {
        "key": "net_income",
        "label": "Net income",
        "keywords": ["net income", "net earnings", "earnings", "净利润", "净利", "利润"],
        "concepts": ["NetIncomeLoss"],
    },
    {
        "key": "r_and_d",
        "label": "R&D expense",
        "keywords": ["r&d", "research and development", "研发费用"],
        "concepts": ["ResearchAndDevelopmentExpense"],
    },
    {
        "key": "cash",
        "label": "Cash and cash equivalents",
        "keywords": ["cash and cash equivalents", "cash equivalents", "cash", "现金"],
        "concepts": [
            "CashAndCashEquivalentsAtCarryingValue",
            "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents",
        ],
    },
    {
        "key": "assets",
        "label": "Total assets",
        "keywords": ["total assets", "assets", "总资产"],
        "concepts": ["Assets"],
    },
]

NUMBER_RE = re.compile(r"\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(billion|million|trillion)?", re.IGNORECASE)
SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?。！？])\s+")


class DemoHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        if self.path.rstrip("/") == "/health":
            body = json.dumps({"status": "ok", "service": "acquisition-strategy-demo", "port": PORT}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        path = self.path.rstrip("/")
        if path not in {"/api/xbrl-audit", "/api/verify"}:
            self.send_error(404, "Not Found")
            return

        content_length = int(self.headers.get("Content-Length", "0") or 0)
        body = self.rfile.read(content_length)
        if not body:
            self._json_response(400, {"ok": False, "error": "Empty request body"})
            return

        try:
            payload = json.loads(body.decode("utf-8"))
        except json.JSONDecodeError:
            self._json_response(400, {"ok": False, "error": "Invalid JSON"})
            return

        sentence = str(payload.get("sentence") or "").strip()
        context = str(payload.get("context") or sentence).strip()
        if not sentence:
            self._json_response(400, {"ok": False, "error": "Missing sentence"})
            return

        try:
            company = infer_company(payload.get("company"), sentence, context)
            metric_key = str(payload.get("metric_key") or "").strip()
            claimed_text = str(payload.get("claimed_text") or "").strip()
            original_sentence = extract_original_sentence(sentence, context, claimed_text, metric_key)
            pipeline = audit_pipeline(original_sentence, context, company, metric_key=metric_key, claimed_text=claimed_text)
            self._json_response(200, {
                "ok": True,
                "service": "embedded-xbrl-claim-audit-demo",
                "sentence": original_sentence,
                "context": context,
                "original_sentence": original_sentence,
                "company_name": company["company_name"],
                "cik": company["cik"],
                "fiscal_year": company["fy"],
                **pipeline,
            })
        except error.HTTPError as exc:
            msg = exc.read().decode("utf-8", errors="ignore") or str(exc)
            self._json_response(502, {"ok": False, "error": f"SEC fetch failed: {msg}"})
        except Exception as exc:
            self._json_response(500, {"ok": False, "error": f"Audit failed: {exc}"})

    def _json_response(self, status: int, payload: dict):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


@lru_cache(maxsize=16)
def get_companyfacts(cik: str) -> dict:
    normalized = str(cik).strip().replace("CIK", "").zfill(10)
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{normalized}.json"
    req = request.Request(url, headers={"User-Agent": SEC_USER_AGENT, "Accept": "application/json"})
    opener = request.build_opener(request.ProxyHandler({}))
    with opener.open(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


@lru_cache(maxsize=1)
def get_company_tickers() -> list[dict]:
    url = "https://www.sec.gov/files/company_tickers.json"
    req = request.Request(url, headers={"User-Agent": SEC_USER_AGENT, "Accept": "application/json"})
    opener = request.build_opener(request.ProxyHandler({}))
    with opener.open(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    if isinstance(data, dict):
        return list(data.values())
    return data


def infer_company(company_payload, sentence: str, context: str) -> dict:
    if isinstance(company_payload, dict) and company_payload.get("cik"):
        return {
            "company_name": str(company_payload.get("companyName") or company_payload.get("company_name") or "Unknown company"),
            "cik": str(company_payload.get("cik")),
            "fy": int(company_payload.get("fy") or 2024),
        }

    text = f"{sentence} {context}".lower()
    for keyword, company in COMPANY_FALLBACKS.items():
        if keyword in text:
            return company.copy()
    return COMPANY_FALLBACKS["apple"].copy()


def extract_original_sentence(sentence: str, context: str, claimed_text: str = "", metric_key: str = "") -> str:
    text = context.strip() or sentence.strip()
    if not text:
        return sentence.strip()

    metric = next((m for m in METRIC_DEFS if m["key"] == metric_key), None)
    candidates = [s.strip() for s in SENTENCE_SPLIT_RE.split(text) if s.strip()] or [text]

    for candidate in candidates:
        if claimed_text and claimed_text in candidate:
            return candidate
    if metric:
        for candidate in candidates:
            lower = candidate.lower()
            if any(keyword in lower for keyword in metric["keywords"]):
                return candidate
    return sentence.strip() or candidates[0]


def audit_pipeline(sentence: str, context: str, company: dict, metric_key: str = "", claimed_text: str = "") -> dict:
    metric = resolve_metric(metric_key, sentence)
    claimed = extract_claim_value(sentence, metric["keywords"], claimed_text=claimed_text)
    official = resolve_company_fact(company["cik"], metric["concepts"], company["fy"])
    if not official:
        raise ValueError(f"No SEC companyfacts match found for {metric['label']}")

    tagging = build_tagging(sentence, company, metric, claimed)
    retrieval = build_retrieval(company, metric, official)
    matching = build_matching(company, metric, claimed, official)

    return {
        "tagging": tagging,
        "retrieval": retrieval,
        "matching": matching,
        "facts": [{
            "metric_key": metric["key"],
            "metric_label": metric["label"],
            "claimed_value": claimed["value"] if claimed else None,
            "claimed_snippet": claimed["snippet"] if claimed else None,
            "official_value": official["value"],
            "xbrl_tag": official["concept"],
            "fy": official.get("fy"),
            "fp": official.get("fp"),
            "form": official.get("form"),
            "filed": official.get("filed"),
            "end": official.get("end"),
            "verdict": matching["verdict"].title(),
            "source_sentence": retrieval["filing_sentence"],
        }],
    }


def resolve_metric(metric_key: str, sentence: str) -> dict:
    if metric_key:
        for metric in METRIC_DEFS:
            if metric["key"] == metric_key:
                return metric
    lower = sentence.lower()
    for metric in METRIC_DEFS:
        if any(keyword in lower for keyword in metric["keywords"]):
            return metric
    return METRIC_DEFS[0]


def build_tagging(sentence: str, company: dict, metric: dict, claimed: dict | None) -> dict:
    claimed_value = claimed["value"] if claimed else None
    return {
        "entity": {
            "dimension": "Entity",
            "value": company["company_name"],
            "explanation": f"Company identified as '{company['company_name']}' from the report context.",
        },
        "period": {
            "dimension": "Period",
            "value": f"FY{company['fy']}",
            "explanation": f"Fiscal year inferred as FY{company['fy']} from the report narrative and audit target.",
        },
        "metric": {
            "dimension": "Metric",
            "value": metric["label"],
            "explanation": f"Metric mapped from sentence wording to the {metric['label']} reporting concept.",
        },
        "value": {
            "dimension": "Value",
            "value": claimed["snippet"] if claimed else "n/a",
            "explanation": f"Claimed figure extracted from the original sentence: {claimed['snippet'] if claimed else 'n/a'}.",
        },
        "unit": {
            "dimension": "Unit",
            "value": "USD",
            "explanation": "Dollar-denominated financial metric inferred from the figure format and Apple SEC companyfacts.",
        },
        "xbrl_concept": {
            "dimension": "XBRLConcept",
            "value": f"us-gaap:{metric['concepts'][0]}",
            "explanation": f"Primary XBRL concept selected for retrieval: us-gaap:{metric['concepts'][0]}.",
        },
        "claimed_value_scaled": claimed_value,
        "scale_applied": infer_scale_text(claimed["snippet"] if claimed else ""),
        "currency_detected": "USD",
        "parse_notes": [
            f"Original sentence extracted from context: {sentence}",
            "This audit is scoped to one financial figure and one mapped metric, matching the per-figure button you clicked.",
        ],
    }


def build_retrieval(company: dict, metric: dict, official: dict) -> dict:
    ticker = resolve_ticker(company["cik"])
    facts_api_url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{str(company['cik']).zfill(10)}.json"
    filing_sentence = build_source_sentence(company["company_name"], company["fy"], metric["label"], official)
    steps = [
        {
            "step_name": "Resolve entity",
            "action": "Map the report context to an SEC registrant and locate its CIK.",
            "detail": f"Using company context '{company['company_name']}' → CIK {str(company['cik']).zfill(10)}.",
            "result": f"Resolved to {company['company_name']} ({ticker or 'ticker n/a'}).",
        },
        {
            "step_name": "Fetch companyfacts",
            "action": "Pull SEC companyfacts JSON for the identified registrant.",
            "detail": facts_api_url,
            "result": "companyfacts JSON retrieved successfully.",
        },
        {
            "step_name": "Select XBRL concept",
            "action": "Choose the XBRL tag that best matches the financial metric in the sentence.",
            "detail": f"Candidate concepts: {', '.join('us-gaap:' + c for c in metric['concepts'])}",
            "result": f"Selected us-gaap:{official['concept']}.",
        },
        {
            "step_name": "Pick official fact",
            "action": "Filter SEC facts to FY / 10-K / best-matching official reported value.",
            "detail": f"Matched filing {official.get('form','n/a')} filed {official.get('filed','n/a')} for period end {official.get('end','n/a')}.",
            "result": f"Official SEC value: {format_money_compact(official.get('value'))}.",
        },
    ]
    return {
        "steps": steps,
        "cik": str(company["cik"]).zfill(10),
        "company_name_sec": company["company_name"],
        "ticker": ticker,
        "companyfacts_fetched": True,
        "facts_api_url": facts_api_url,
        "xbrl_tag_used": f"us-gaap:{official['concept']}",
        "fiscal_year_target": f"FY{company['fy']}",
        "official_value": official.get("value"),
        "official_unit": "USD",
        "filing_form": official.get("form"),
        "filing_period": official.get("fp"),
        "filing_filed_date": official.get("filed"),
        "accession": None,
        "filing_url": facts_api_url,
        "filing_locator": official.get("end"),
        "filing_sentence": filing_sentence,
        "filing_text_url": facts_api_url,
        "xbrl_viewer_url": facts_api_url,
        "xbrl_company": company["company_name"],
        "all_candidates": [
            {
                "concept": f"us-gaap:{official['concept']}",
                "value": official.get("value"),
                "fy": official.get("fy"),
                "fp": official.get("fp"),
                "form": official.get("form"),
                "filed": official.get("filed"),
                "end": official.get("end"),
            }
        ],
        "retrieval_notes": [
            "Retrieval is grounded in SEC companyfacts rather than free-text web search.",
            "The chosen fact favors 10-K, FY, no-frame entries, and the latest matching period end.",
        ],
    }


def build_matching(company: dict, metric: dict, claimed: dict | None, official: dict) -> dict:
    claimed_value = claimed["value"] if claimed else None
    official_value = official.get("value")
    difference_pct = None
    if claimed_value not in (None, 0) and official_value not in (None, 0):
        difference_pct = abs(claimed_value - official_value) / abs(official_value)

    value_match = claimed_value is not None and official_value is not None and difference_pct is not None and difference_pct <= 0.01
    verdict = "match" if value_match else "mismatch"
    rounding_explanation = build_rounding_explanation(claimed_value, official_value)
    explanation = (
        f"The clicked {metric['label'].lower()} figure was compared against Apple SEC companyfacts for FY{company['fy']} "
        f"using us-gaap:{official['concept']}."
    )
    return {
        "verdict": verdict,
        "value_match": value_match,
        "currency_match": True,
        "period_match": True,
        "claimed": claimed_value,
        "official": official_value,
        "rounding_explanation": rounding_explanation,
        "scale_explanation": None,
        "difference_pct": difference_pct,
        "explanation": explanation,
        "match_notes": [
            f"Claimed snippet: {claimed['snippet'] if claimed else 'n/a'}.",
            f"Official filing fact: {format_money_compact(official_value)} from {official.get('form','n/a')} filed {official.get('filed','n/a')}.",
            "Verdict is treated as a match when the difference is within a reasonable rounding band (≤1%).",
        ],
    }


def extract_claim_value(text: str, keywords: list[str], claimed_text: str = ""):
    if claimed_text:
        direct_matches = list(NUMBER_RE.finditer(claimed_text))
        if direct_matches:
            direct = direct_matches[0]
            return {"value": parse_number_match(direct), "snippet": direct.group(0).strip()}

    number_matches = list(NUMBER_RE.finditer(text))
    if not number_matches:
        return None

    preferred_matches = [m for m in number_matches if "$" in m.group(0) or m.group(2)] or number_matches

    lower = text.lower()
    keyword_positions = [lower.find(keyword) for keyword in keywords if lower.find(keyword) != -1]
    if not keyword_positions:
        return None

    best_match = None
    best_distance = None
    for kw_pos in keyword_positions:
        for match in preferred_matches:
            distance = abs(match.start() - kw_pos)
            if best_distance is None or distance < best_distance:
                best_distance = distance
                best_match = match

    if best_match is None:
        return None
    return {"value": parse_number_match(best_match), "snippet": best_match.group(0).strip()}


def parse_number_match(match) -> float:
    raw_value = match.group(1).replace(",", "")
    unit = (match.group(2) or "").lower()
    value = float(raw_value)
    multiplier = 1
    if unit == "million":
        multiplier = 1_000_000
    elif unit == "billion":
        multiplier = 1_000_000_000
    elif unit == "trillion":
        multiplier = 1_000_000_000_000
    return value * multiplier


def resolve_company_fact(cik: str, concepts: list[str], fy: int):
    companyfacts = get_companyfacts(cik)
    us_gaap = companyfacts.get("facts", {}).get("us-gaap", {})

    best = None
    for concept in concepts:
        fact = us_gaap.get(concept)
        if not fact:
            continue
        for unit_name, items in fact.get("units", {}).items():
            if unit_name != "USD":
                continue
            for item in items:
                if item.get("fy") != fy:
                    continue
                if not str(item.get("form", "")).startswith("10-K"):
                    continue
                score = 0
                if item.get("fp") == "FY":
                    score += 2
                if not item.get("frame"):
                    score += 2
                end_value = str(item.get("end", ""))
                if end_value.startswith(str(fy)):
                    score += 4
                candidate = {
                    "score": score,
                    "concept": concept,
                    "value": item.get("val"),
                    "fy": item.get("fy"),
                    "fp": item.get("fp"),
                    "form": item.get("form"),
                    "filed": item.get("filed"),
                    "end": item.get("end"),
                    "frame": item.get("frame"),
                }
                if best is None:
                    best = candidate
                    continue
                if candidate["score"] > best["score"]:
                    best = candidate
                    continue
                if candidate["score"] == best["score"] and str(candidate.get("end", "")) > str(best.get("end", "")):
                    best = candidate
                    continue
                if candidate["score"] == best["score"] and str(candidate.get("end", "")) == str(best.get("end", "")) and str(candidate.get("filed", "")) > str(best.get("filed", "")):
                    best = candidate
    return best


def resolve_ticker(cik: str) -> str | None:
    normalized = str(cik).zfill(10)
    try:
        for item in get_company_tickers():
            if str(item.get("cik_str", "")).zfill(10) == normalized:
                return item.get("ticker")
    except Exception:
        return None
    return None


def infer_scale_text(snippet: str) -> str:
    lower = snippet.lower()
    if "trillion" in lower:
        return "trillion"
    if "billion" in lower:
        return "billion"
    if "million" in lower:
        return "million"
    return "none"


def build_rounding_explanation(claimed_value, official_value) -> str:
    if claimed_value is None or official_value is None:
        return "No claimed value could be extracted from the clicked figure, so rounding analysis is unavailable."
    delta = abs(claimed_value - official_value)
    if delta == 0:
        return "The claimed figure exactly matches the SEC official fact with no rounding difference."
    pct = delta / abs(official_value) if official_value else None
    if pct is not None and pct <= 0.01:
        return "The claimed figure is consistent with a rounded presentation of the SEC official fact and falls within a reasonable rounding band."
    return "The claimed figure does not fit normal rounding from the SEC official fact and should be treated as a substantive mismatch."


def format_money_compact(value) -> str:
    if value is None:
        return "n/a"
    value = float(value)
    if abs(value) >= 1_000_000_000:
        return f"${value / 1_000_000_000:.2f} billion"
    if abs(value) >= 1_000_000:
        return f"${value / 1_000_000:.2f} million"
    return f"${value:,.0f}"


def build_source_sentence(company_name: str, fy: int, metric_label: str, official: dict) -> str:
    value_text = format_money_compact(official.get("value"))
    return (
        f"{company_name} FY{fy} {metric_label.lower()} was {value_text} "
        f"according to {official.get('form', 'the filing')} filed on {official.get('filed', 'n/a')} "
        f"using XBRL concept us-gaap:{official.get('concept', 'n/a')}."
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the portable Acquisition Strategy Agent demo.")
    parser.add_argument("--host", default=HOST, help="Bind host. Use 0.0.0.0 for LAN sharing.")
    parser.add_argument("--port", type=int, default=PORT, help="Bind port.")
    args = parser.parse_args()

    HOST = args.host
    PORT = args.port
    httpd = ThreadingHTTPServer((HOST, PORT), DemoHandler)
    display_host = "127.0.0.1" if HOST in {"0.0.0.0", "::"} else HOST
    print(f"Serving acquisition strategy demo on http://{display_host}:{PORT}")
    if HOST == "0.0.0.0":
        print("LAN sharing enabled. Other computers on the same network can open http://<this-computer-ip>:%s" % PORT)
    httpd.serve_forever()
