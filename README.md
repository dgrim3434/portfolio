# Pilot portfolio

A static site that lists AI pilots and gives each one a page with a live demo. There's no build step: plain HTML, CSS and JS, served by Cloudflare Workers from the `public/` folder. Every `git push` to `main` redeploys the site.

## Repo layout

```
wrangler.jsonc            Cloudflare config (Worker name + folder to serve)
public/
  index.html              Home page: thesis, pilot status board, about
  pilot/index.html        One template for every pilot page (/pilot/?id=...)
  data/pilots.json        ALL site content: your info + every pilot
  demos/<pilot-id>/       Self-hosted demos (HTML/JS that runs in the browser)
  styles.css, site.js     Shared styling and helpers
  404.html
```

## One-time setup

### 1. Put this repo on GitHub
1. On github.com, click **New repository**. Name it (e.g. `portfolio`), keep it empty (no README), create it.
2. On your computer, in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```

### 2. Connect GitHub to Cloudflare
1. Cloudflare dashboard → **Workers & Pages** → **Create application**.
2. Choose **Import a repository** (Continue with GitHub), authorize Cloudflare, and pick the repo.
3. Settings:
   - **Project name:** `portfolio` (must match `"name"` in `wrangler.jsonc`; change both if you want a different name)
   - **Build command:** leave blank
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`
4. Deploy. You'll get a `portfolio.<something>.workers.dev` URL. Check it works.

### 3. Point your domain at it
1. Open the Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain**.
2. Enter your domain (e.g. `yourname.com`), then add `www.yourname.com` the same way.
3. Because you bought the domain through Cloudflare, DNS and HTTPS are set up automatically. It can take a few minutes.

## Adding a pilot

1. Add an entry to `public/data/pilots.json`:
   ```json
   {
     "id": "rag-contracts",
     "title": "Contract Q&A assistant",
     "status": "live",
     "domain": "Legal ops",
     "problem": "One sentence: the business problem.",
     "built": "One or two sentences: what you shipped.",
     "result": "What changed, and how you measured it.",
     "metric": "62% faster review",
     "stack": ["Python", "FastAPI", "pgvector"],
     "demo": { "type": "iframe", "url": "https://huggingface.co/spaces/you/rag-contracts" },
     "repo": "https://github.com/you/rag-contracts",
     "writeup": "Architecture, tradeoffs, what you'd change for production."
   }
   ```
2. `status` is `live`, `building` or `planned`. Planned pilots show on the board but don't link to a page.
3. Commit and push. Cloudflare redeploys in about a minute.

### Picking a demo type

| Your pilot is... | `demo.type` | Where it runs |
|---|---|---|
| Browser-only HTML/JS | `static`, url `/demos/<id>/` | This site. Put files in `public/demos/<id>/` |
| A Python app (Streamlit, Gradio, FastAPI + UI) | `iframe` | Hugging Face Spaces, Streamlit Community Cloud, Render, etc. Paste its URL |
| Hard to host, or needs paid API keys | `video` | A YouTube or Loom embed URL, or an `.mp4` in `public/demos/` |
| Not ready | `none` | Shows "Demo coming soon" |

Notes:
- This site is static, so it **can't run Python**. Python pilots live on their own host and get embedded.
- Streamlit Community Cloud: add `?embed=true` to the app URL for a clean embed.
- Never put API keys in `public/`. Anything there is downloadable by anyone. If a demo needs a key, call the API from the host that runs your backend (or a Worker with a secret), not from browser JS.
- Every pilot page also shows an "Open demo in a new tab" link, so a host that blocks embedding still works.

## Run it locally

```bash
cd public
python3 -m http.server 8000
```
Open http://localhost:8000. (Opening `index.html` directly won't work, because the page loads `pilots.json` with `fetch`.)

## Before you share the link
- Replace the email, GitHub and LinkedIn placeholders in `pilots.json`.
- Replace or delete the two example pilots and `public/demos/example-demo/`.
- Edit the `<title>` in `public/index.html` if you want your full name in browser tabs and search results.
