# Acquisition Strategy Agents

This folder contains two agent specifications built from the provided acquisition strategy flowcharts and aligned with the earlier shell-company screening agent style: planner → intent clarification → iterative tool use → offline/online analysis → structured strategy report.

## Files

- `buyer_acquisition_strategy_agent.json` — Acquisition strategy agent（buyer perspective ）
- `target_acquisition_strategy_agent.json` — Acquisition strategy agent（target perspective ）

## Shared Agent Pattern

Both agents follow the same architecture:

1. User input
2. LLM planning and intent clarification
3. Step-by-step analytical workflow
4. Iterative tool use, including document parsing, filings/public search, financial modeling, valuation, risk screening, and report writing
5. Evidence-backed output report
6. Final recommendation with confidence, assumptions, and data gaps

## Buyer Agent Core Question

Should the buyer pursue the acquisition, at what price, under what structure, with what financing and risk mitigants?

## Target Agent Core Question

Should the target accept, reject, negotiate, run a market check, or pursue alternatives given the offer and standalone value?


## UI decision

The public demo is split into separate standalone pages:

- Buyer page: `buyer.html`
- Seller / target page: `target.html`
- Root page: `index.html`, a simple selector linking to the two standalone pages

Each standalone page is locked to its own perspective, workflow, test case, flowchart, and report. There is no in-page buyer/target switch.

## Portable prototype

Run the local server to view the standalone pages with embedded XBRL audit support:

```bash
python3 server.py
```

Then open `http://127.0.0.1:8123/buyer.html` or `http://127.0.0.1:8123/target.html`.

The report UI contains figure-level `XBRL` buttons. These call the embedded `/api/xbrl-audit` endpoint in this same app, so the old standalone `localhost:8010` XBRL demo is no longer required.

For cross-computer viewing and LAN sharing instructions, see `RUN_ON_OTHER_COMPUTER.md`.
