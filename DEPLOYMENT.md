# Deployment Guide

Founder School Agent runs anywhere Node.js runs. It works in **demo mode** with no configuration,
so you can deploy a fully functional public demo for free, then optionally add an API key for live AI.

Two recommended paths are below.

- [Option A — Render (one-click blueprint)](#option-a--render-recommended)
- [Option B — Hugging Face Spaces (Docker)](#option-b--hugging-face-spaces-docker)

---

## Option A — Render (recommended)

The repository already includes a [`render.yaml`](./render.yaml) blueprint, so Render configures
everything automatically.

### Steps

1. **Push the repo to GitHub** (already done if you cloned it from GitHub).
2. Go to [render.com](https://render.com) and sign in.
3. Click **New → Blueprint**.
4. Connect your GitHub account and select the `founder-school-agent` repository.
5. Render reads `render.yaml`, detects the Node web service in `agent/`, and pre-fills:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Root directory:** `agent`
6. Click **Apply**. Render builds and gives you a public URL (for example
   `https://founder-school-agent.onrender.com`).
7. Open the URL — the app is live in **demo mode**.

### (Optional) Enable live AI on Render

1. In the Render dashboard, open your service → **Environment**.
2. Add `OPENAI_API_KEY` with your key.
3. Adjust `OPENAI_BASE_URL` and `OPENAI_MODEL` if you use a non-OpenAI provider (the blueprint
   defaults to Anthropic Claude). Save — Render redeploys automatically.

> **Note:** Render's free tier sleeps after inactivity, so the first request after idle may take a few
> seconds to wake.

---

## Option B — Hugging Face Spaces (Docker)

Hugging Face Spaces can host the app as a **Docker Space**. A ready-to-use `Dockerfile` is included at
[`agent/Dockerfile`](./agent/Dockerfile).

### Steps

1. Create a free account at [huggingface.co](https://huggingface.co).
2. Click **New → Space**.
3. Configure the Space:
   - **Owner / Space name:** e.g. `your-name/founder-school-agent`
   - **SDK:** select **Docker** → **Blank**
   - **Visibility:** Public
4. In the new Space, add the project files. The simplest way is to push from your machine:

   ```bash
   # from the repo root
   git remote add space https://huggingface.co/spaces/<your-username>/founder-school-agent
   git push space main
   ```

   Hugging Face needs the `Dockerfile` at the **build context root**, so either:
   - point the Space build to the `agent/` directory, or
   - copy `agent/Dockerfile` to the repo root before pushing (it builds `agent/` either way).

5. The Space builds the Docker image and starts the app. Hugging Face Spaces listen on **port 7860**,
   which the included `Dockerfile` sets via `ENV PORT=7860`.
6. Once the build finishes, your public demo is live at
   `https://huggingface.co/spaces/<your-username>/founder-school-agent`.

### (Optional) Enable live AI on Hugging Face

1. In the Space, go to **Settings → Variables and secrets**.
2. Add `OPENAI_API_KEY` (and optionally `OPENAI_BASE_URL`, `OPENAI_MODEL`) as **secrets**.
3. The Space restarts and serves live AI answers.

---

## Deploy checklist

- [ ] App runs locally with `npm start`.
- [ ] Repository pushed to GitHub.
- [ ] Platform chosen (Render or Hugging Face Spaces).
- [ ] Public URL loads in demo mode.
- [ ] (Optional) `OPENAI_API_KEY` added as a secret for live mode.
- [ ] Live demo URL added to the top of the [README](./README.md).

---

## Environment variables reference

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | No | — | Enables live LLM answers. Omit for demo mode. |
| `OPENAI_BASE_URL` | No | `https://api.openai.com/v1` | Any OpenAI-compatible endpoint. |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | Model name for the chosen provider. |
| `PORT` | No | `3000` | Port the server listens on. |
