# Ayoub Playground 🎮

Live HTML/CSS/JS code editor with AI assistant — preview instantly, get help from OpenRouter AI.

**Design:** Brown/Dark theme  
**AI:** OpenRouter (free tier) — set `OPENROUTER_API_KEY` in env

## 📂 Files

| File | Description |
|------|-------------|
| `worker.js` | Cloudflare Worker (ES Modules) | 
| `index.html` | Standalone HTML — open directly in browser |
| `README.md` | This file |

## 🚀 Deploy to Cloudflare Workers (Dashboard)

1. Go to **Workers & Pages** → Create Worker
2. Delete default code → Paste content of `worker.js`
3. Go to **Settings → Environment Variables** → Add:
   - `OPENROUTER_API_KEY` — your OpenRouter API key (for AI chat)
4. (Optional) **KV + Telegram**:
   - Bind KV namespace `VISITORS` for visitor tracking
   - Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
5. Deploy 🎉

## 🔌 Endpoints

| Path | Method | Description |
|------|--------|-------------|
| `/` | GET | Playground page |
| `/api/chat` | POST | AI chat via OpenRouter |
| `/visits` | GET | Visitor data (if KV bound) |

## 🎨 Features

- **Live Preview** — edit HTML/CSS/JS, see result instantly
- **Error Detection** — runtime errors in preview are caught and shown
- **AI Assistant** — right sidebar, context-aware, with code apply buttons
- **Download** — export project as standalone HTML file
- **Theme Toggle** — Dark/Light mode
- **Visitor Tracking** — Telegram + KV (optional)

Made with ❤️ from Vienna
