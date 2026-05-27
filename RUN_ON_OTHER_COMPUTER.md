# Run on another computer

This folder is a portable demo package for the **Acquisition Strategy Agent**.

It includes:

- Buyer / target acquisition strategy agent UI
- Apple → DarwinAI sample case
- Markdown + PDF reports
- Embedded XBRL audit endpoint, based on the earlier XBRL claim-audit demo
- No separate `localhost:8010` service required

## Requirements

- Python 3.9+ recommended
- Internet access for XBRL audit, because the audit calls SEC companyfacts APIs
- A browser

No Python packages are required for the local server; it uses the Python standard library.

## Run locally on the same computer

macOS / Linux:

```bash
cd acquisition_strategy_agents
python3 server.py
```

Windows PowerShell:

```powershell
cd acquisition_strategy_agents
python server.py
```

Then open:

```text
http://127.0.0.1:8123
```

## Share on the same Wi-Fi / LAN

On the computer hosting the demo:

```bash
python3 server.py --host 0.0.0.0 --port 8123
```

Then find that computer's local IP address and open this from another computer on the same network:

```text
http://<host-computer-ip>:8123
```

Example:

```text
http://192.168.1.23:8123
```

## XBRL audit test

After starting the server, this should return a `match` verdict:

```bash
curl -X POST http://127.0.0.1:8123/api/xbrl-audit \
  -H 'Content-Type: application/json' \
  --data '{"sentence":"Apple FY2024 net income was $93.7 billion."}'
```

The UI also exposes this through the small `XBRL` buttons beside auditable financial figures in the report.

## Notes

- If the page opens but XBRL audit fails, check internet access to `data.sec.gov`.
- If another computer cannot open the page over LAN, check firewall permissions and make sure the server was started with `--host 0.0.0.0`.
