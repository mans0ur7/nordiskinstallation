# Nordisk Installation

Info-hjemmeside for VVS-firmaet Nordisk Installation. Ren statisk HTML — intet build-step,
ingen backend, ingen dependencies.

**Live:** https://nordiskinstallation.dk

## Opsætning

| Del | Løsning |
|-----|---------|
| Kode | GitHub: `mans0ur7/nordiskinstallation` |
| Hosting | Netlify — auto-deploy fra branch `main` |
| Netlify-site | `voluble-pegasus-662407.netlify.app` |
| Domæne | `nordiskinstallation.dk` (+ `www`) |
| Redirect | `nordiskinstallation.com` (+ `www`) → `.dk`, 301, sti bevares |
| DNS | **One.com** — navneservere blev bevidst IKKE flyttet |
| Mail | One.com, på `.dk` — urørt gennem hele opsætningen |
| HTTPS | Let's Encrypt, alle 4 domæner, fornyes automatisk |

Netlify blev valgt frem for Cloudflare Pages, fordi Cloudflare kræver at hele DNS-zonen
flyttes til dem. Det ville have flyttet MX, SPF og DMARC på én gang — den eneste ændring
der reelt kunne lukke firmaets mail. Med Netlify blev kun A- og CNAME-records ændret.

Vercels gratis Hobby-plan blev fravalgt, fordi den eksplicit forbyder kommerciel brug.

## Sådan retter man siden

1. Ret `public/index.html`
2. `git add -A && git commit -m "..." && git push`
3. Netlify bygger og udgiver automatisk på ca. 1 minut

Kun mappen `public/` bliver udgivet. `README.md` og `DNS-BACKUP.md` forbliver private —
det er sat i `netlify.toml`.

## DNS hos One.com

Disse fire records blev oprettet. **Alt andet blev ikke rørt.**

| Domæne | Type | Navn | Værdi |
|--------|------|------|-------|
| `.dk` | A | *(tom)* | `75.2.60.5` |
| `.dk` | CNAME | `www` | `voluble-pegasus-662407.netlify.app` |
| `.com` | A | *(tom)* | `75.2.60.5` |
| `.com` | CNAME | `www` | `voluble-pegasus-662407.netlify.app` |

## ⚠️ Mail

Mailen på `@nordiskinstallation.dk` kører hos One.com og afhænger af DNS-records som
**ikke** må ændres: 4 MX-records, en SPF TXT-record og en DMARC-record.

DMARC står på `p=reject` og der er ingen DKIM. Konsekvensen: hvis SPF-recorden forsvinder
eller bliver forkert, bliver udgående mail **afvist** af modtagerne — ikke spam-markeret.

Nøjagtige værdier: **[DNS-BACKUP.md](DNS-BACKUP.md)**

To ting der skal undgås:
- **"Nulstil DNS records"** i One.coms panel sletter alt uden fortryd-mulighed
- **Opsig ikke One.com-abonnementet** — postkasser og DNS-zone ligger i det

## Filer

| Fil | Indhold |
|-----|---------|
| `public/index.html` | Selve siden (pt. tom, afventer indhold) |
| `netlify.toml` | Publish-mappe + `.com`-redirects |
| `DNS-BACKUP.md` | DNS-tilstand før migration — sikkerhedsnet |

## Næste skridt

Siden er bevidst tom sort — infrastrukturen blev sat op først. Indhold og design mangler:
kontaktoplysninger, ydelser, dækningsområde, CVR.
