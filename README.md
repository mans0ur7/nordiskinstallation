# Nordisk Installation

Info-hjemmeside for VVS-firmaet Nordisk Installation. Ren statisk HTML/CSS — intet build-step,
ingen backend, ingen dependencies.

## Opsætning

| Del | Løsning |
|-----|---------|
| Kode | GitHub: `mans0ur7/nordiskinstallation` |
| Hosting | Cloudflare Pages (auto-deploy fra branch `main`) |
| Domæne | `nordiskinstallation.dk` — primær |
| Redirect | `nordiskinstallation.com` → `nordiskinstallation.dk` |
| Mail | One.com, på `.dk` |

Cloudflare Pages er valgt frem for Vercel, fordi Cloudflares gratis plan tillader kommerciel
brug. Vercels gratis Hobby-plan gør ikke, og en firmahjemmeside er kommerciel brug.

## Sådan retter man indholdet

1. Ret teksten i `index.html` (kontaktinfo, telefonnummer) eller udseendet i `styles.css`.
2. `git add -A && git commit -m "beskrivelse" && git push`
3. Cloudflare Pages bygger og udgiver automatisk på få sekunder.

## ⚠️ Mail — læs før du rører DNS

Mailen på `@nordiskinstallation.dk` kører hos One.com og afhænger af DNS-records som **ikke**
må slettes: 4 MX-records, en SPF TXT-record og en DMARC-record.

DMARC står på **`p=reject`**. Konsekvensen: hvis SPF-recorden forsvinder eller bliver
forkert, bliver udgående mail **afvist** af modtagerne — ikke bare spam-markeret.

De nøjagtige værdier fra før migrationen er dokumenteret i **[DNS-BACKUP.md](DNS-BACKUP.md)**.
Brug den fil som facitliste, hvis noget skal gendannes.

Tommelfingerregel i Cloudflare: alle mail-records (MX, SPF, DMARC, evt. DKIM) skal stå som
**"DNS only" — grå sky**. En proxied (orange sky) MX-record ødelægger mailmodtagelse.

## Filer

| Fil | Indhold |
|-----|---------|
| `index.html` | Sidens indhold og tekst |
| `styles.css` | Udseende |
| `DNS-BACKUP.md` | DNS-tilstand før migration — sikkerhedsnet |

## Lokal visning

Åbn `index.html` direkte i en browser. Ingen server nødvendig.
