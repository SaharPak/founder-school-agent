# Screenshots

Real, captured screenshots of the running app (demo mode, zero setup). These are embedded in the
[root README](../../README.md).

| File | What it shows |
| --- | --- |
| `01-home.png` | **Home screen** — hero, brand, and the Founder Coach welcome. |
| `02-user-input.png` | **User input example** — a founder typing a question into the coach. |
| `03-ai-response.png` | **AI response example** — the streamed coaching reply with a 48-hour next step. |
| `04-idea-validator.png` | **Idea Validator** — a full scored validation report. |
| `05-event-architect.png` | **Event Architect** — a complete generated event plan. |
| `06-terminal.png` | **Terminal execution** — clone, install, and run with one command. |

## Regenerating the screenshots

The app screenshots were captured from the live app running locally:

```bash
cd agent
npm install
npm start            # → http://localhost:3000
```

Then capture each screen (Home, Coach conversation, Idea Validator, Event Architect). Any browser
screenshot tool works; for crisp results use a 2x device scale factor and a ~1180px-wide viewport.
