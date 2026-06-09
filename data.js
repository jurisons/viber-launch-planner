/* Viber penetration by market. Edit this list to update the tool — no logic changes needed.
   `pct` is the share reachable on Viber; `approx` shows a "~" prefix.
   Figures refined from user-provided market data (2026-06). Moldova is an estimate
   (no published % was given — it's a top-tier Viber market); adjust if you have a source. */
const COUNTRIES = [
  { name: 'Ukraine',     pct: 92 },
  { name: 'Serbia',      pct: 90 },
  { name: 'Greece',      pct: 90 },
  { name: 'Belarus',     pct: 90 },
  { name: 'Bulgaria',    pct: 90 },
  { name: 'Moldova',     pct: 88, approx: true },
  { name: 'Israel',      pct: 75 },
  { name: 'Philippines', pct: 71 },
  { name: 'Iraq',        pct: 45, approx: true },
  { name: 'Myanmar',     pct: 45, approx: true },
  { name: 'Vietnam',     pct: 25, approx: true },
  { name: 'Western EU',  pct: 5,  approx: true },
  { name: 'UK / US',     pct: 3,  approx: true },
];
