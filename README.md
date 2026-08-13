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
| `public/index.html` | Forside |
| `public/ydelser.html` | Energioptimering, magnetitrensning, vandbehandling, service |
| `public/om-os.html` | Om firmaet, værdier, dækningsområde |
| `public/kontakt.html` | Kontaktoplysninger + formular |
| `public/tak.html` | Kvittering efter indsendt formular |
| `public/404.html` | Fejlside |
| `public/assets/style.css` | Alt design — ét designsystem med CSS-variabler |
| `public/assets/app.js` | Menu, lyskegle, scroll-indikator, indtoning |
| `public/assets/fonts/` | To variable fonte + deres licenser |
| `public/robots.txt`, `public/sitemap.xml` | SEO |
| `netlify.toml` | Publish-mappe + `.com`-redirects |
| `DNS-BACKUP.md` | DNS-tilstand før migration — sikkerhedsnet |

Sidernes URL'er er uden `.html` (`/ydelser`, `/om-os`, `/kontakt`) — det klarer Netlify selv.

## Design

Stilretningen hedder **FREMLØB / RETUR** og er hentet direkte fra faget: ethvert dansk
varmeanlæg er mærket rød for fremløb og blå for retur. Det er sidens farvemodel —
kobber-orange mod dyb blå på varmt tegningspapir, med blåsort tusch til tekst:

| Farve | Variabel | Betyder |
|-------|----------|---------|
| Kobber-orange | `--hot` / `--hot-ink` | Fremløb — varmen, energien, CTA'er |
| Dyb blå | `--cold` / `--cold-ink` | Retur — vandet, kulden |
| Blåsort | `--ink` | Tusch — tekst og streger |
| Varmt papir | `--paper` | Grundfladen, med et fint milimeterpapir-gitter |

Alt styres fra tokens i toppen af `style.css`. Udtrykket er "teknisk tegning":
mono-annoteringer, sigtekorn i hjørnerne, hårde offset-skygger som lag i en tegning,
og en rørkreds i heroen hvor fremløbs- og returflow kører live.

Bevægelsen er tydelig med vilje: overskriftens linjer stiger op ved indlæsning,
flowet i rørkredsen kører konstant, illustrationerne animerer det de handler om
(varme stiger, magnetit synker, visere går rundt). Alt starter først når feltet er
scrollet ind, og alt respekterer `prefers-reduced-motion` med en synlig hviletilstand.

**Fonte:** Bricolage Grotesque til overskrifter, Inter til brødtekst og JetBrains Mono
til tekniske annoteringer — alle variable og selvhostede fra `public/assets/fonts/`
(tilsammen ca. 165 KB). De hentes altså ikke fra Google, hvilket både er hurtigere og
undgår GDPR-problemet med at sende besøgendes IP-adresser til en tredjepart. Alle tre er
udgivet under SIL Open Font License; licensteksterne ligger ved siden af fontfilerne.

Ingen scripts, billeder eller andet hentes udefra. Alle illustrationer er inline SVG.

## Lokal forhåndsvisning

Filerne kan ikke bare åbnes direkte i browseren, fordi links og stier er absolutte.
Start en lokal server i stedet:

```
npx serve public
```

## Kontaktformular

Formularen på `/kontakt` bruger **Netlify Forms** — ingen backend, ingen tredjepart.
Netlify opdager formularen ved deploy, fordi den har `data-netlify="true"` og et skjult
`form-name`-felt. Efter indsendelse sendes brugeren videre til `/tak`.

Spam håndteres af et honeypot-felt (`bot-field`), som mennesker ikke kan se.

**Engangsopsætning i Netlify** — indsendelser lander i Netlifys panel, men mailen skal slås
til én gang: *Site configuration → Forms → Form notifications → Add notification →
Email notification*. Vælg formularen `kontakt` og indtast firmaets mailadresse.

Gratisplanen dækker 100 indsendelser om måneden.

## Mangler stadig

- **Telefonnummer** — firmaet har ikke et endnu. Siden nævner bevidst intet nummer;
  kontakt sker via formularen og `kontakt@nordiskinstallation.dk`. Når nummeret findes,
  skal det ind i footeren på alle sider, i kontaktlisten på `/kontakt` og i CTA-knapperne
- **CVR-nummer** — firmaet har ikke et endnu. Skal i footeren, når det kommer
- Rigtige billeder fra opgaver, hvis de skal erstatte illustrationerne
