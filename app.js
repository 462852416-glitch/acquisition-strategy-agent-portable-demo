const buyerModules = [
  ['B1', 'Transaction Context', 'Define the transaction perimeter, parties, asset scope, timing, and the precise buyer-side decision question.'],
  ['B2', 'Buyer Objective Definition', 'Translate Apple’s acquisition intent into explicit objectives, success metrics, and go / no-go criteria.'],
  ['B3', 'Target Business Quality', 'Assess whether DarwinAI is fundamentally worth owning, including asset quality, resilience, and red flags.'],
  ['B4', 'Industry & Competitive Position', 'Evaluate market context, peer positioning, disruption risk, and DarwinAI’s external competitive strength.'],
  ['B5', 'Strategic Fit', 'Map DarwinAI’s capabilities to Apple’s product, platform, technology, geographic, and cultural needs.'],
  ['B6', 'Standalone Financial Analysis', 'Build the target’s standalone financial view before synergies and separate fact from assumption.'],
  ['B7', 'Valuation & Purchase Price', 'Estimate fair value, compare to indicative pricing, and define Apple’s maximum supportable bid.'],
  ['B8', 'Synergies & Value Creation', 'Quantify how Apple could create value post-close through revenue, cost, capability, and timing synergies.'],
  ['B9', 'Deal Structure', 'Recommend transaction form, consideration mix, and buyer protections that preserve value.'],
  ['B10', 'Financing & Capital Structure Impact', 'Assess funding feasibility, balance-sheet impact, liquidity, and shareholder effects.'],
  ['B11', 'Returns Analysis', 'Test whether the acquisition clears hurdle rates under base, upside, and downside scenarios.'],
  ['B12', 'Due Diligence Findings', 'Convert diligence evidence into valuation issues, term protections, integration actions, and walk-away risks.'],
  ['B13', 'Regulatory / Integration / Downside Risk', 'Evaluate antitrust, execution, integration, and downside-case risks beyond headline attractiveness.'],
  ['B14', 'Recommendation', 'Synthesize the work into a buyer-side acquisition recommendation, bid posture, and next steps.']
];

const targetModules = [
  ['T1', 'Transaction / Offer Context', 'Understand the buyer’s offer, conditions, timeline, and the immediate board decision question.'],
  ['T2', 'Target Shareholder Objective', 'Define shareholder and board-side decision criteria, acceptance thresholds, and negotiation goals.'],
  ['T3', 'Standalone Case', 'Estimate what DarwinAI shareholders own if the company does not sell and continues independently.'],
  ['T4', 'Offer Attractiveness', 'Assess the headline and real attractiveness of Apple’s proposal after risk adjustments.'],
  ['T5', 'Valuation Fairness', 'Determine whether the offer is financially fair relative to standalone value and comparable frameworks.'],
  ['T6', 'Consideration & Control Premium', 'Check whether shareholders are adequately compensated for selling control and surrendering upside.'],
  ['T7', 'Buyer Motivation & Strategic Need', 'Infer Apple’s strategic urgency, ability to pay, and the leverage DarwinAI can use in negotiation.'],
  ['T8', 'Strategic Alternatives', 'Compare selling to Apple with independence, financing, partnership, or alternative transactions.'],
  ['T9', 'Market Check / Auction Potential', 'Decide whether the board should run a limited market check, targeted outreach, or broader process.'],
  ['T10', 'Deal Certainty', 'Assess closing probability, financing certainty, conditions, and terms needed to improve execution confidence.'],
  ['T11', 'Governance & Stakeholder Impact', 'Review board process, management incentives, employee treatment, and other stakeholder consequences.'],
  ['T12', 'Negotiation Strategy', 'Set the target-side response path, counteroffer asks, and practical leverage points.'],
  ['T13', 'Accept vs Reject Scenario Analysis', 'Compare accept, negotiate, reject, and alternative-process outcomes on value, risk, and timing.'],
  ['T14', 'Recommendation', 'Produce the final target-side board recommendation and required next steps.']
];

const sharedAuditCompany = {
  companyName: 'Apple Inc.',
  cik: '0000320193',
  fy: 2024,
  sourceUrl: 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json'
};

const auditMetricDefs = [
  { key: 'revenue', label: 'Revenue', keywords: ['revenue', 'sales'] },
  { key: 'net_income', label: 'Net income', keywords: ['net income', 'net earnings', 'earnings'] },
  { key: 'r_and_d', label: 'R&D expense', keywords: ['r&d', 'research and development'] },
  { key: 'cash', label: 'Cash and cash equivalents', keywords: ['cash and cash equivalents', 'cash equivalents', 'cash'] },
  { key: 'assets', label: 'Total assets', keywords: ['total assets', 'assets'] },
];

const perspectives = {
  buyer: {
    key: 'buyer',
    label: 'Buyer perspective',
    planningTitle: 'Buyer-side planning & clarification',
    workflowTitle: 'Buyer workflow modules',
    image: './assets/buyer-flowchart.jpg',
    markdownPath: './reports/apple_darwinai_buyer_report.md',
    pdfPath: './reports/apple_darwinai_buyer_report.pdf',
    reportSections: [
      'Transaction Overview',
      'Buyer Strategic Objective',
      'Target Business Quality',
      'Industry & Competitive Position',
      'Strategic Fit',
      'Standalone Financial Analysis',
      'Valuation & Purchase Price',
      'Synergy & Value Creation',
      'Deal Structure',
      'Financing & Capital Structure Impact',
      'Returns Analysis',
      'Due Diligence Findings',
      'Regulatory / Integration / Downside Risk',
      'Recommendation'
    ],
    modules: buyerModules,
    auditCompany: sharedAuditCompany,
    plan: {
      intent: 'Evaluate whether Apple should buy DarwinAI as a capability acquisition tied to efficient on-device AI.',
      question: 'Is DarwinAI strategically useful enough to accelerate Apple’s AI roadmap in a way that justifies the price and integration effort?',
      focus: 'Product fit, model-efficiency value, Apple silicon relevance, build-vs-buy logic, retention, IP cleanliness, and integration risk.',
      output: 'A buyer-side acquisition recommendation with concrete integration and diligence priorities.'
    }
  },
  target: {
    key: 'target',
    label: 'Target perspective',
    planningTitle: 'Target-side planning & clarification',
    workflowTitle: 'Target workflow modules',
    image: './assets/target-flowchart.jpg',
    markdownPath: './reports/apple_darwinai_target_report.md',
    pdfPath: './reports/apple_darwinai_target_report.pdf',
    reportSections: [
      'Transaction / Offer Context',
      'Target Shareholder Objective',
      'Standalone Case',
      'Offer Attractiveness',
      'Valuation Fairness',
      'Consideration & Control Premium',
      'Buyer Motivation & Strategic Need',
      'Strategic Alternatives',
      'Market Check / Auction Potential',
      'Deal Certainty',
      'Governance & Stakeholder Impact',
      'Negotiation Strategy',
      'Accept vs Reject Scenario Analysis',
      'Recommendation'
    ],
    modules: targetModules,
    auditCompany: sharedAuditCompany,
    plan: {
      intent: 'Evaluate whether DarwinAI should accept Apple’s offer, negotiate harder, or test alternatives.',
      question: 'Does Apple’s proposal fairly compensate DarwinAI shareholders and employees for giving up control and future upside?',
      focus: 'Strategic value versus acqui-hire pricing, standalone risk, market-check logic, deal certainty, employee treatment, and negotiation leverage.',
      output: 'A target-side board recommendation with specific negotiation asks.'
    }
  }
};

const testCases = {
  'buyer-apple-darwinai': {
    perspective: 'buyer',
    text: `Apple acquisition of DarwinAI — Buyer Perspective

Buyer: Apple Inc.
Target: DarwinAI
Transaction type: Strategic capability acquisition (on-device AI optimization)

Decision question: Should Apple acquire DarwinAI to accelerate on-device AI deployment across iPhone, iPad, Watch, and Vision Pro product lines?

Key considerations:
- Strategic fit: DarwinAI's model compression and hardware-aware inference expertise aligns with Apple's device-centric AI needs
- Valuation: Estimated $200-300M for 50-person team with specialized edge AI optimization capabilities
- Alternatives: Internal hiring (18-24 months), internal development (resource-constrained), or alternative acquisitions (limited options)
- Integration: Retention of key technical staff, diffusion of optimization methods across Apple's AI organization
- Returns: Expected 10-20x return driven by 6-9 month deployment acceleration and improved on-device AI performance

Please provide a comprehensive buyer-side acquisition recommendation covering target quality, strategic fit, valuation, synergies, deal structure, financing, returns analysis, due diligence priorities, risks, and final recommendation.`
  },
  'target-apple-darwinai': {
    perspective: 'target',
    text: `Apple acquisition of DarwinAI — Target Perspective

Buyer: Apple Inc.
Target: DarwinAI
Offer context: Apple has expressed acquisition interest; indicative valuation likely $200-280M

Decision question: Should DarwinAI's board accept Apple's offer, negotiate for better terms, or pursue alternatives?

Key considerations:
- Standalone value: Risk-adjusted NPV ~$110-125M (requires $35-50M dilutive financing, 3-4 year path)
- Fair valuation range: $250-350M based on comparable transactions and strategic value to Apple
- Strategic alternatives: Google (comparable interest), Microsoft/Amazon/NVIDIA (20-40% lower offers), or remain independent
- Negotiation leverage: Scarcity of edge AI optimization expertise, Apple's strategic urgency, potential competitive bidders
- Deal structure: Target 85% cash at close, 15% earnout with objective milestones, separate retention pool for employees

Please provide a comprehensive target-side board recommendation covering standalone case, valuation fairness, control premium, buyer motivation, strategic alternatives, market check strategy, deal certainty, governance considerations, negotiation strategy, and final recommendation.`
  },
  blank: {
    perspective: 'buyer',
    text: ''
  }
};


let activePerspective = 'buyer';
let loadedReports = { buyer: '', target: '' };
let activeRunTimer = null;

function $(id) { return document.getElementById(id); }

function setText(id, value) {
  const node = $(id);
  if (node) node.textContent = value;
}

function planningHtml(plan, moduleCount) {
  return `
    <div class="plan-row"><span>Intent</span><p>${escapeHtml(plan.intent)}</p></div>
    <div class="plan-row"><span>Core question</span><p>${escapeHtml(plan.question)}</p></div>
    <div class="plan-row"><span>Mapped modules</span><p>${moduleCount} modules aligned to the workflow overview.</p></div>
    <div class="plan-row"><span>Analysis focus</span><p>${escapeHtml(plan.focus)}</p></div>
    <div class="plan-row"><span>Output</span><p>${escapeHtml(plan.output)}</p></div>
  `;
}

function moduleHtml([id, title, body], index, activeIndex, detailHtml = '') {
  const state = index < activeIndex ? 'done' : index === activeIndex ? 'active' : '';
  const status = index < activeIndex ? 'Complete' : index === activeIndex ? 'Running' : 'Queued';
  const displayId = String(id).replace(/^[A-Za-z]+/, '');
  return `<div class="workflow-item ${state}">
    <div class="workflow-id">${displayId}</div>
    <div>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(body)}</p>
      ${detailHtml ? `<div class="workflow-detail">${detailHtml}</div>` : ''}
    </div>
    <span>${status}</span>
  </div>`;
}

function escapeHtml(text = '') {
  return String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function parseInline(text = '') {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[(.+?)\]\((https?:\/\/[^\s)]+|\.\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
  return html;
}

function parseTable(lines, startIndex) {
  const rows = [];
  let i = startIndex;
  while (i < lines.length && lines[i].trim().startsWith('|')) {
    rows.push(lines[i].trim());
    i += 1;
  }
  const filtered = rows.filter((row, idx) => !(idx === 1 && /^\|[-\s|:]+\|?$/.test(row)));
  const cells = filtered.map(row => row.split('|').slice(1, -1).map(cell => parseInline(cell.trim())));
  if (!cells.length) return { html: '', nextIndex: i };
  const head = cells[0];
  const body = cells.slice(1);
  const html = `
    <div class="report-table-wrap">
      <table class="report-table">
        <thead><tr>${head.map(cell => `<th>${cell}</th>`).join('')}</tr></thead>
        <tbody>${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>`;
  return { html, nextIndex: i };
}

function extractTitle(markdown = '') {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function getSectionHtmlMap(markdown = '') {
  const lines = markdown.split('\n');
  const sections = {};
  let current = null;
  let buffer = [];

  function flush() {
    if (!current) return;
    sections[current] = markdownToHtml(buffer.join('\n').trim());
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('## ')) {
      flush();
      current = line.slice(3).trim();
      buffer = [];
      continue;
    }
    if (!current) continue;
    buffer.push(raw);
  }

  flush();
  return sections;
}

function splitSentences(text = '') {
  const normalized = String(text).replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  const matches = normalized.match(/[^.!?]+[.!?]?/g);
  return (matches || [normalized]).map(item => item.trim()).filter(Boolean);
}

function extractFinancialMarkers(sentence = '') {
  const metricHits = [];
  const lower = sentence.toLowerCase();

  auditMetricDefs.forEach(metric => {
    metric.keywords.forEach(keyword => {
      let fromIndex = 0;
      while (fromIndex < lower.length) {
        const index = lower.indexOf(keyword, fromIndex);
        if (index === -1) break;
        metricHits.push({ metricKey: metric.key, metricLabel: metric.label, index, keyword });
        fromIndex = index + keyword.length;
      }
    });
  });

  if (!metricHits.length) return [];

  const numberRegex = /\$\s?\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:billion|million|trillion))?|\b\d+(?:\.\d+)?\s*(?:billion|million|trillion)\b|\b\d+(?:\.\d+)?%/ig;
  const numberMatches = Array.from(sentence.matchAll(numberRegex)).filter(match => /\$|billion|million|trillion|%/i.test(match[0]));

  return numberMatches.map(match => {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    let bestMetric = null;
    let bestDistance = null;

    metricHits.forEach(hit => {
      const distance = Math.abs(start - hit.index);
      if (bestDistance == null || distance < bestDistance) {
        bestDistance = distance;
        bestMetric = hit;
      }
    });

    if (!bestMetric) return null;
    return {
      start,
      end,
      text: match[0],
      metricKey: bestMetric.metricKey,
      metricLabel: bestMetric.metricLabel,
    };
  }).filter(Boolean);
}

function renderAuditedSentence(sentence = '', paragraph = '') {
  const markers = extractFinancialMarkers(sentence);
  if (!markers.length) return parseInline(sentence);

  const company = perspectives[activePerspective]?.auditCompany || sharedAuditCompany;
  let html = '';
  let cursor = 0;

  markers.forEach(marker => {
    html += parseInline(sentence.slice(cursor, marker.start));
    html += `<span class="auditable-number">${parseInline(marker.text)}<button class="number-audit-button" type="button" data-sentence="${escapeHtml(sentence)}" data-context="${escapeHtml(paragraph)}" data-company-name="${escapeHtml(company.companyName)}" data-cik="${escapeHtml(company.cik)}" data-fy="${escapeHtml(company.fy)}" data-metric-key="${escapeHtml(marker.metricKey)}" data-metric-label="${escapeHtml(marker.metricLabel)}" data-claimed-text="${escapeHtml(marker.text)}">XBRL</button></span>`;
    cursor = marker.end;
  });

  html += parseInline(sentence.slice(cursor));
  return html;
}

function renderParagraph(line = '') {
  const paragraph = String(line).trim();
  const sentences = splitSentences(paragraph);
  if (!sentences.length) return parseInline(paragraph);
  return sentences.map(sentence => renderAuditedSentence(sentence, paragraph)).join(' ');
}

function markdownToHtml(markdown = '') {
  const lines = markdown.split('\n');
  let html = '';
  let inList = false;
  let skippedFirstH1 = false;

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      if (inList) { html += '</ul>'; inList = false; }
      continue;
    }

    if (line.startsWith('|')) {
      if (inList) { html += '</ul>'; inList = false; }
      const table = parseTable(lines, i);
      html += table.html;
      i = table.nextIndex - 1;
      continue;
    }

    if (line.startsWith('# ')) {
      if (!skippedFirstH1) {
        skippedFirstH1 = true;
        continue;
      }
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h1>${parseInline(line.slice(2))}</h1>`;
      continue;
    }

    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2>${parseInline(line.slice(3))}</h2>`;
      continue;
    }

    if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${parseInline(line.slice(4))}</h3>`;
      continue;
    }

    if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${parseInline(line.slice(2))}</li>`;
      continue;
    }

    if (inList) { html += '</ul>'; inList = false; }
    html += `<p>${renderParagraph(line)}</p>`;
  }

  if (inList) html += '</ul>';
  return html;
}

async function ensureReportsLoaded() {
  const entries = Object.values(perspectives);
  await Promise.all(entries.map(async item => {
    if (!loadedReports[item.key]) {
      const response = await fetch(item.markdownPath, { cache: 'no-store' });
      loadedReports[item.key] = await response.text();
    }
  }));
}

function renderPerspective() {
  const p = perspectives[activePerspective];
  const markdown = loadedReports[activePerspective] || '';
  const sectionHtml = getSectionHtmlMap(markdown);
  setText('planningTitle', p.planningTitle);
  setText('workflowTitle', p.workflowTitle);
  $('workflowImage').src = p.image;
  $('openMarkdownLink').href = p.markdownPath;
  $('downloadPdfLink').href = p.pdfPath;
  $('planningOutput').innerHTML = planningHtml(p.plan, p.modules.length);
  $('workflowList').innerHTML = p.modules.map((item, index) => moduleHtml(item, index, -1, sectionHtml[p.reportSections[index]] || '')).join('');

  const extractedTitle = extractTitle(markdown);
  if (extractedTitle) setText('reportTitle', extractedTitle);
  $('reportBody').innerHTML = markdownToHtml(markdown);

  document.querySelectorAll('.switch-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.perspective === activePerspective);
  });
}

function setRunButtonState({ running = false, done = false } = {}) {
  const btn = $('runAgentBtn');
  if (!btn) return;
  btn.disabled = running;
  btn.textContent = running ? 'Running…' : done ? 'Run again' : 'Run agent';
}

function runActiveAgent() {
  const p = perspectives[activePerspective];
  const sectionHtml = getSectionHtmlMap(loadedReports[activePerspective] || '');
  if (activeRunTimer) {
    clearInterval(activeRunTimer);
    activeRunTimer = null;
  }

  setRunButtonState({ running: true });
  let index = 0;
  const max = p.modules.length;

  activeRunTimer = setInterval(() => {
    $('workflowList').innerHTML = p.modules.map((item, itemIndex) => moduleHtml(item, itemIndex, index, sectionHtml[p.reportSections[itemIndex]] || '')).join('');
    index += 1;
    if (index > max) {
      clearInterval(activeRunTimer);
      activeRunTimer = null;
      $('workflowList').innerHTML = p.modules.map((item, itemIndex) => moduleHtml(item, itemIndex, max, sectionHtml[p.reportSections[itemIndex]] || '')).join('');
      setRunButtonState({ done: true });
      document.querySelector('.report-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 170);
}

function applyCase(caseKey) {
  const c = testCases[caseKey];
  if (!c) return;
  activePerspective = c.perspective;
  $('mandateInput').value = c.text;
  document.querySelectorAll('.case-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.case === caseKey));
  renderPerspective();
  setRunButtonState();
}

function closeAuditModal() {
  $('auditModalShell')?.classList.add('hidden');
}

function formatNumber(value) {
  if (value == null || value === '') return 'n/a';
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatDollarCompact(value) {
  if (value == null || value === '') return 'n/a';
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(num);
}

function formatPercent(value) {
  if (value == null || value === '') return 'n/a';
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return `${(num * 100).toFixed(3)}%`;
}

function getVerdictUi(verdict = '') {
  const normalized = String(verdict || '').toLowerCase();
  if (normalized === 'match') return { klass: 'match', icon: '✅', text: 'Match' };
  if (normalized === 'mismatch') return { klass: 'nomatch', icon: '⚠️', text: 'Mismatch' };
  return { klass: 'error', icon: 'ℹ️', text: verdict || 'Unknown' };
}

function renderVerdictBanner(matching = {}) {
  const ui = getVerdictUi(matching.verdict);
  return `<div class="verdict-banner ${ui.klass}">
    <div class="verdict-icon">${ui.icon}</div>
    <div>
      <div class="verdict-text">${escapeHtml(ui.text)}</div>
      <div class="verdict-sub">${escapeHtml(matching.explanation || 'XBRL audit completed.')}</div>
    </div>
  </div>`;
}

function renderTaggingStep(tagging = {}) {
  const dims = [
    tagging.entity,
    tagging.period,
    tagging.metric,
    tagging.value,
    tagging.unit,
    tagging.xbrl_concept,
  ].filter(Boolean);

  return `<section class="audit-step-card">
    <div class="audit-step-header">
      <div class="audit-step-num s1">1</div>
      <div class="audit-step-info">
        <h3>XBRL Tagging · 语义标注</h3>
        <p>六维度 XBRL fact 解析结果</p>
      </div>
    </div>
    <div class="audit-step-content">
      <table class="dim-table">
        <thead><tr><th>Dimension</th><th>Extracted value</th><th>Explanation</th></tr></thead>
        <tbody>
          ${dims.map(dim => `<tr>
            <td><span class="dim-value">${escapeHtml(dim.dimension || 'n/a')}</span></td>
            <td>${dim.dimension === 'XBRLConcept' ? `<span class="tag-pill">${escapeHtml(dim.value || 'n/a')}</span>` : `<span class="dim-value">${escapeHtml(dim.value || 'n/a')}</span>`}</td>
            <td><div class="dim-explain">${escapeHtml(dim.explanation || '')}</div></td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${tagging.parse_notes?.length ? `<div class="match-notes"><ul>${tagging.parse_notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul></div>` : ''}
    </div>
  </section>`;
}

function renderRetrievalStep(retrieval = {}) {
  return `<section class="audit-step-card">
    <div class="audit-step-header">
      <div class="audit-step-num s2">2</div>
      <div class="audit-step-info">
        <h3>SEC Retrieval · 数据检索</h3>
        <p>SEC companyfacts API 检索链路</p>
      </div>
    </div>
    <div class="audit-step-content">
      <div class="company-grid">
        <div class="info-box"><div class="info-box-label">CIK</div><div class="info-box-value">${escapeHtml(retrieval.cik || '-')}</div></div>
        <div class="info-box"><div class="info-box-label">Company</div><div class="info-box-value info-box-company">${escapeHtml(retrieval.company_name_sec || '-')}</div></div>
        <div class="info-box"><div class="info-box-label">Ticker</div><div class="info-box-value">${escapeHtml(retrieval.ticker || '-')}</div></div>
        <div class="info-box"><div class="info-box-label">Filing</div><div class="info-box-value info-box-filing">${escapeHtml(retrieval.filing_form || '-')} ${escapeHtml(retrieval.filing_filed_date || '')}</div></div>
      </div>
      <div class="retrieval-chain">
        ${(retrieval.steps || []).map((step, index) => `<div class="r-step">
          <div class="r-dot">${index + 1}</div>
          <div class="r-content">
            <div class="r-action">${escapeHtml(step.action || step.step_name || '')}</div>
            <div class="r-detail">${escapeHtml(step.detail || '')}</div>
            ${step.result ? `<div class="r-result">${escapeHtml(step.result)}</div>` : ''}
          </div>
        </div>`).join('')}
      </div>
      <div class="evidence-box">
        <div class="evidence-head">
          <div class="evidence-title">Official filing evidence</div>
          <div class="evidence-links">
            ${retrieval.facts_api_url ? `<a class="evidence-link xbrl" href="${escapeHtml(retrieval.facts_api_url)}" target="_blank" rel="noreferrer noopener">companyfacts</a>` : ''}
            ${retrieval.xbrl_viewer_url ? `<a class="evidence-link" href="${escapeHtml(retrieval.xbrl_viewer_url)}" target="_blank" rel="noreferrer noopener">XBRL source</a>` : ''}
          </div>
        </div>
        <div class="evidence-meta">${escapeHtml(retrieval.xbrl_tag_used || 'n/a')} · ${escapeHtml(retrieval.fiscal_year_target || 'n/a')} · ${escapeHtml(retrieval.filing_locator || 'n/a')}</div>
        <div class="evidence-snippet">${escapeHtml(retrieval.filing_sentence || 'n/a')}</div>
      </div>
      ${retrieval.retrieval_notes?.length ? `<div class="match-notes"><ul>${retrieval.retrieval_notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul></div>` : ''}
    </div>
  </section>`;
}

function renderMatchingStep(matching = {}) {
  const variance = matching.claimed != null && matching.official != null
    ? Number(matching.claimed) - Number(matching.official)
    : null;
  return `<section class="audit-step-card">
    <div class="audit-step-header">
      <div class="audit-step-num s3">3</div>
      <div class="audit-step-info">
        <h3>Matching · 差异比对</h3>
        <p>Claimed figure vs SEC official fact</p>
      </div>
    </div>
    <div class="audit-step-content">
      <div class="match-grid">
        <div class="match-box"><div class="match-box-label">Claimed</div><div class="match-box-value">${formatDollarCompact(matching.claimed)}</div></div>
        <div class="match-box highlight"><div class="match-box-label">Official</div><div class="match-box-value">${formatDollarCompact(matching.official)}</div></div>
        <div class="match-box"><div class="match-box-label">Difference</div><div class="match-box-value">${variance == null ? 'n/a' : formatDollarCompact(variance)}</div><div class="match-box-sub">${formatPercent(matching.difference_pct)}</div></div>
      </div>
      <div class="round-box">
        <div class="round-box-label">Rounding explanation</div>
        <div class="round-box-text">${escapeHtml(matching.rounding_explanation || 'n/a')}</div>
      </div>
      <div class="audit-detail">
        <p><strong>Value match:</strong> ${matching.value_match ? 'Yes' : 'No'}</p>
        <p><strong>Currency match:</strong> ${matching.currency_match ? 'Yes' : 'No'}</p>
        <p><strong>Period match:</strong> ${matching.period_match ? 'Yes' : 'No'}</p>
      </div>
      ${matching.match_notes?.length ? `<div class="match-notes"><ul>${matching.match_notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul></div>` : ''}
    </div>
  </section>`;
}

function renderAuditPipeline(data = {}) {
  return `${renderVerdictBanner(data.matching || {})}${renderTaggingStep(data.tagging || {})}${renderRetrievalStep(data.retrieval || {})}${renderMatchingStep(data.matching || {})}`;
}

async function openAuditModal(button) {
  const modal = $('auditModalShell');
  const body = $('auditModalBody');
  if (!modal || !body) return;

  const sentence = button.dataset.sentence || '';
  const context = button.dataset.context || sentence;
  const metricKey = button.dataset.metricKey || '';
  const metricLabel = button.dataset.metricLabel || '';
  const claimedText = button.dataset.claimedText || '';
  const company = {
    companyName: button.dataset.companyName || sharedAuditCompany.companyName,
    cik: button.dataset.cik || sharedAuditCompany.cik,
    fy: Number(button.dataset.fy || sharedAuditCompany.fy) || sharedAuditCompany.fy,
    sourceUrl: sharedAuditCompany.sourceUrl
  };

  modal.classList.remove('hidden');
  body.innerHTML = `
    <div class="audit-loading">Running XBRL audit for this financial figure…</div>
    <div class="audit-context-block">
      <p><strong>Clicked figure:</strong> ${escapeHtml(claimedText || 'n/a')}</p>
      ${metricLabel ? `<p><strong>Inferred metric:</strong> ${escapeHtml(metricLabel)}</p>` : ''}
      <p><strong>Context paragraph:</strong> ${escapeHtml(context || sentence)}</p>
    </div>`;

  const isStaticPublicPage = location.hostname.endsWith('github.io');
  if (isStaticPublicPage) {
    body.innerHTML = `
      <div class="audit-error">
        <strong>Static public demo mode</strong>
        <p>This public GitHub Pages version runs the Acquisition Strategy Agent interface, workflow, reports, and downloads without a local server. The live XBRL audit button requires the portable Python backend in the local package.</p>
        <div class="audit-context-block">
          <p><strong>Clicked figure:</strong> ${escapeHtml(claimedText || 'n/a')}</p>
          ${metricLabel ? `<p><strong>Inferred metric:</strong> ${escapeHtml(metricLabel)}</p>` : ''}
          <p><strong>Original sentence:</strong> ${escapeHtml(sentence)}</p>
          ${context ? `<p><strong>Context paragraph:</strong> ${escapeHtml(context)}</p>` : ''}
          <p><strong>Reference:</strong> <a href="${escapeHtml(company.sourceUrl || sharedAuditCompany.sourceUrl)}" target="_blank" rel="noreferrer noopener">SEC companyfacts source</a></p>
        </div>
      </div>`;
    return;
  }

  try {
    const resp = await fetch('/api/xbrl-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sentence,
        context,
        company,
        metric_key: metricKey,
        claimed_text: claimedText
      })
    });
    const data = await resp.json();
    if (!resp.ok || !data.ok) throw new Error(data.error || `Audit failed (${resp.status})`);

    body.innerHTML = `
      <div class="audit-context-block">
        <p><strong>Clicked figure:</strong> ${escapeHtml(claimedText || 'n/a')}</p>
        ${metricLabel ? `<p><strong>Inferred metric:</strong> ${escapeHtml(metricLabel)}</p>` : ''}
        <p><strong>Original sentence:</strong> ${escapeHtml(data.original_sentence || data.sentence || sentence)}</p>
        ${data.context && data.context !== (data.original_sentence || data.sentence) ? `<p><strong>Context paragraph:</strong> ${escapeHtml(data.context)}</p>` : ''}
        <p><strong>Audit entity:</strong> ${escapeHtml(data.company_name || company.companyName)} · FY${escapeHtml(data.fiscal_year || company.fy)} · ${escapeHtml(data.service || 'embedded XBRL audit')}</p>
      </div>
      ${renderAuditPipeline(data)}`;
  } catch (err) {
    body.innerHTML = `
      <div class="audit-error">
        <strong>XBRL audit unavailable</strong>
        <p>${escapeHtml(err.message || String(err))}</p>
        <div class="audit-context-block">
          <p><strong>Clicked figure:</strong> ${escapeHtml(claimedText || 'n/a')}</p>
          ${metricLabel ? `<p><strong>Inferred metric:</strong> ${escapeHtml(metricLabel)}</p>` : ''}
          <p><strong>Original sentence:</strong> ${escapeHtml(sentence)}</p>
          ${context ? `<p><strong>Context paragraph:</strong> ${escapeHtml(context)}</p>` : ''}
        </div>
      </div>`;
  }
}

function bindAuditUi() {
  document.addEventListener('click', event => {
    const button = event.target.closest('.number-audit-button');
    if (button) {
      event.preventDefault();
      openAuditModal(button);
      return;
    }

    if (event.target.closest('#auditModalClose, #auditModalBackdrop')) {
      closeAuditModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAuditModal();
  });
}

function getInitialPerspectiveFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const explicit = params.get('perspective') || params.get('side');
  const path = window.location.pathname.toLowerCase();
  if (explicit === 'target' || explicit === 'seller' || path.endsWith('/target.html') || path.endsWith('/seller.html')) return 'target';
  if (explicit === 'buyer' || path.endsWith('/buyer.html')) return 'buyer';
  return 'buyer';
}

async function init() {
  activePerspective = getInitialPerspectiveFromUrl();
  await ensureReportsLoaded();
  bindAuditUi();
  // 默认显示通用模板，不自动选择案例
  $('mandateInput').value = activePerspective === 'target'
    ? 'Buyer: Company A\nTarget: Company B\n\nWe are evaluating whether TargetCo should accept, reject, negotiate, run a market check, or pursue alternatives. Please assess standalone value, offer attractiveness, valuation fairness, deal certainty, negotiation strategy, and final recommendation.'
    : 'Buyer: Company A\nTarget: Company B\n\nWe are evaluating whether BuyerCo should acquire TargetCo. Please assess target quality, strategic fit, valuation, deal structure, financing, risks, and post-close value creation.';
  renderPerspective();
  setRunButtonState();

  document.querySelectorAll('.switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activePerspective = btn.dataset.perspective;
      renderPerspective();
      setRunButtonState();
    });
  });

  document.querySelectorAll('.case-btn').forEach(btn => {
    btn.addEventListener('click', () => applyCase(btn.dataset.case));
  });

  $('runAgentBtn')?.addEventListener('click', runActiveAgent);
}

document.addEventListener('DOMContentLoaded', init);
