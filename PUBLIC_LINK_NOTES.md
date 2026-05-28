# Public GitHub Pages version

This is the public static deployment of the Acquisition Strategy Agent portable demo.

- The root page is now a link selector only.
- Buyer and seller/target are standalone pages, not an in-page perspective switch:
  - Buyer: `https://462852416-glitch.github.io/acquisition-strategy-agent-portable-demo/buyer.html`
  - Seller/Target: `https://462852416-glitch.github.io/acquisition-strategy-agent-portable-demo/target.html`
- Each standalone page is locked to its own workflow, test case, report, and flowchart.
- The live XBRL audit endpoint is a Python-backend feature of the original portable package. In this public static version, clicking an XBRL audit button shows a static-mode explanation and links to the SEC companyfacts source instead of calling a local `/api/xbrl-audit` backend.
