# Nordisk Installation

Info-hjemmeside for VVS-firmaet Nordisk Installation. Ren statisk HTML/CSS — intet build-step, ingen backend.

## Opsætning (oversigt)

| Del | Løsning |
|-----|---------|
| Kode | GitHub repo `Nordiskinstallation` |
| Hosting | Vercel (auto-deploy fra GitHub `main`) |
| Domæne | One.com: `nordiskinstallation.dk` (primær) + `.com` (redirect → `.dk`) |
| Mail | One.com mail på `.dk` — MX-records må IKKE ændres |

## Sådan retter man indholdet

- Tekst og kontaktinfo ligger i `index.html`.
- Udseende ligger i `styles.css`.
- Gem, `git commit`, `git push` → Vercel deployer automatisk på få sekunder.

## ⚠️ Vigtigt om DNS og mail

Når `.dk` peges mod Vercel, ændres KUN:
- `A`-record for roden (`@`) → `76.76.21.21`
- `CNAME` for `www` → `cname.vercel-dns.com`

**MX-records (mail) og evt. SPF/TXT for mail skal stå urørt**, ellers stopper mailen.

## Lokal visning

Åbn `index.html` direkte i en browser — ingen server nødvendig.
