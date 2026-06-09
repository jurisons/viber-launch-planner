# Viber Business Messages — Launch Planner

An interactive, 5-step micro-tool that helps a marketer or product owner decide whether
Viber Business Messages are right for them — and what it takes to go live.

It answers the four questions buyers actually ask (which no spec sheet does in sequence):

1. **Market fit** — are my customers even on Viber? (instant green/amber/red verdict by country)
2. **Use case** — transactional vs. promotional vs. two-way, and what each implies
3. **Message preview** — what a verified Viber message actually looks like on a phone
4. **Readiness check** — a personalised timeline + the blockers that catch most senders
5. **Get started** — lead capture, with an optional live demo-message hook

## Phase 1 — this repo (static, client-side)

Pure static site, no build step, no backend. Deploys anywhere that serves files.

```
index.html     # markup for all 5 steps + the page shell
styles.css     # design tokens (:root) + all component styles
data.js        # COUNTRIES config — Viber penetration per market (edit freely)
app.js         # step navigation, scoring, readiness logic, lead capture
```

### Run locally

```bash
# any static server works
python3 -m http.server 8000
# then open http://localhost:8000
```
…or just open `index.html` in a browser.

### Update the country data

Edit `data.js` — add/remove entries in `COUNTRIES`. No code changes needed:

```js
{ name: 'Lithuania', pct: 60 },          // shows "60%"
{ name: 'Cambodia',  pct: 30, approx: true } // shows "~30%"
```

## Deploy (Vercel + custom domain `decoded.chat`)

1. Push this repo to GitHub (done).
2. [vercel.com/new](https://vercel.com/new) → **Import** this repo → framework preset **Other** → **Deploy**.
   (No build command, no output dir — Vercel serves the static files as-is.)
3. Project → **Settings → Domains** → add `decoded.chat` (and `www.decoded.chat` if you
   want it). Since `decoded.chat`'s nameservers already point to Vercel, the DNS records
   and SSL are provisioned automatically.

## Phase 2 — the real product (needs your accounts/keys; not in this repo)

The lead form currently validates input and shows a confirmation. The captured `lead`
object in `app.js` (`submitLead()`) is the hand-off point. To make it real:

- **Live Viber demo send** — on submit, POST the phone number to a small backend that
  calls **Messente's Omnichannel API** to send a real Viber Business Message to the lead's
  device within ~60s. This is the core differentiator.
- **CRM capture** — forward the `lead` object to HubSpot/Pipedrive.
- **Follow-up email sequence** — branch on the readiness score: a "ready now" track vs. a
  "needs 4 weeks of prep" track.
- **Country data** — already a config object (`data.js`); move it to a hosted JSON/config
  source if you want updates without a redeploy.

These require API credentials and a server runtime, so they live outside this static repo.
