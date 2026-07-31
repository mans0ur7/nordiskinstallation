# DNS-baseline — før ændringer

Optaget **2026-07-31**, mens begge domæner lå hos One.com med One.coms navneservere.
A/MX/TXT/NS målt via Cloudflare-resolver (1.1.1.1); CAA og DNSSEC via Google DNS-over-HTTPS.

Formålet: hvis mail eller hjemmeside går i stykker efter en DNS-ændring, kan tilstanden
herunder gendannes 1:1.

---

## nordiskinstallation.dk — PRIMÆR, HAR AKTIV MAIL

### 🔴 Mail-records — MÅ ALDRIG SLETTES ELLER ÆNDRES

| Type | Navn | Prioritet | Værdi |
|------|------|-----------|-------|
| MX | `@` | 10 | `mx1.mailpod16-cph3.g1i.one.com` |
| MX | `@` | 10 | `mx2.mailpod16-cph3.g1i.one.com` |
| MX | `@` | 10 | `mx3.mailpod16-cph3.g1i.one.com` |
| MX | `@` | 10 | `mx4.mailpod16-cph3.g1i.one.com` |
| TXT | `@` | — | `v=spf1 include:_custspf.one.com ~all` |
| TXT | `_dmarc` | — | `v=DMARC1; p=reject` |

> ⚠️ **`p=reject` uden DKIM gør SPF-recorden kritisk.**
> Der er ingen DKIM fundet på de gængse selektorer, så *al* autentificering af udgående mail
> hviler alene på SPF. Går SPF tabt, ryger mailen ikke i spam — den bliver **afvist** af
> modtageren. Og fejlen viser sig typisk først 3–48 timer senere, når gamle DNS-cacher udløber.

> ⚠️ MX-værdierne er **kundespecifikke** (`mailpod16-cph3`). De står ikke i nogen offentlig
> guide. Slettes de, skal One.com-support kontaktes for at få dem igen.

### Web-records — det er KUN disse to der skal ændres

| Type | Navn | Værdi | TTL |
|------|------|-------|-----|
| A | `@` | `46.30.211.38` | 600 |
| A | `www` | `46.30.211.38` | 600 |

**🔑 Rollback-værdien: `46.30.211.38`** (One.coms webhotel-IP)

### Navneservere

| Type | Værdi |
|------|-------|
| NS | `ns01.one.com` |
| NS | `ns02.one.com` |

SOA serial ved optagelse: `2026073113`

### Bekræftet fraværende

| | Status | Betydning |
|---|---|---|
| CAA | ✅ Ingen | Alle certifikat-udstedere er tilladt. **Opret ikke en** — den ville også gælde for `mail.`, `imap.`, `smtp.` (RFC 8659 tree-walk) og kunne blokere One.coms egen certifikatfornyelse. |
| DNSSEC | ✅ Ikke aktiveret | Gør en eventuel navneserverflytning markant mindre farlig. |
| DKIM | ✅ Ikke fundet | Tjekket på selektorerne `one`, `default`, `onecom`. Kan ligge på en ugættet selektor — tjek One.com-panelet hvis du vil være sikker. |
| Wildcard, `mail`, `autodiscover`, `autoconfig`, `_autodiscover._tcp` | Ingen | — |

---

## nordiskinstallation.com — SKAL BARE REDIRECTE

| Type | Navn | Værdi |
|------|------|-------|
| NS | `@` | `ns01.one.com`, `ns02.one.com` |
| A | `@` | `46.30.211.38` |
| A | `www` | `46.30.211.38` |
| MX | `@` | `.` (prioritet 0) |
| TXT | `@` | ingen |
| CAA / DNSSEC | ingen | — |

> 🟢 **`MX "." prioritet 0` er en null-MX (RFC 7505)** — en bevidst erklæring om at domænet
> ikke modtager mail. Der er altså **ingen mail at miste på `.com`**. Domænet kan flyttes frit,
> også til andre navneservere. Lav ikke om på null-MX'en.

SOA serial ved optagelse: `2026073102`

---

## Sådan finder du DNS i One.coms panel

1. Log ind på **login.one.com**
2. **Nyt design:** venstremenu → **Domæne** → **DNS-indstillinger**
   **Gammelt design:** flisen **Avancerede indstillinger** (nederst) → **DNS-indstillinger** → **DNS-records**
3. Kan du ikke finde det: skift design med **"Prøv nyt look"** nederst til venstre

### ☠️ Knappen du aldrig må trykke på

Der findes en **"Nulstil DNS records" / "Reset DNS records"**-knap på præcis den side du skal
arbejde på. Den sletter alle dine egne records og gendanner One.coms standard — inklusive at
dine mail-records erstattes. **Der er ingen fortryd-knap og ingen versionshistorik i One.coms
DNS-panel.** Denne fil er dit eneste sikkerhedsnet.

### Felt-detaljer i One.coms formular

| Felt | Hvad du skriver |
|------|-----------------|
| A-record, værtsnavn (for rod-domænet) | **Lad feltet være helt tomt.** Skriv aldrig `nordiskinstallation.dk` — det bliver til `nordiskinstallation.dk.nordiskinstallation.dk` |
| CNAME, værtsnavn | Kun `www` — ikke `www.nordiskinstallation.dk` |
| TTL | `600` (One.coms minimum; gør rollback hurtig. Blank = 3600) |

One.com kan tage **op til 90 minutter** før en ændring er aktiv hos dem.

---

## Rollback-procedure

**Hvis hjemmesiden går galt:**
1. One.com → DNS-records → sæt A-record for `@` og `www` tilbage til `46.30.211.38`
2. Med TTL 600 er du tilbage inden for ca. 10–15 min (plus One.coms publiceringstid)

**Hvis mailen går galt:**
1. Gendan de 6 mail-records ovenfor nøjagtigt som de står — 4x MX (prioritet 10), SPF, DMARC
2. Er navneserverne blevet flyttet: sæt dem tilbage til `ns01.one.com` / `ns02.one.com`
3. Ring til One.com-support hvis MX-værdierne ikke kan gendannes

---

## Sådan verificerer du

```powershell
# Mail-records - skal matche tabellen ovenfor NØJAGTIGT
Resolve-DnsName nordiskinstallation.dk -Type MX -Server 1.1.1.1 | Select Preference,NameExchange
Resolve-DnsName nordiskinstallation.dk -Type TXT -Server 1.1.1.1 | Select -Expand Strings
Resolve-DnsName _dmarc.nordiskinstallation.dk -Type TXT -Server 1.1.1.1 | Select -Expand Strings

# Web-record - denne SKAL være ændret efter migration
Resolve-DnsName nordiskinstallation.dk -Type A -Server 1.1.1.1 | Select IPAddress

# Svarer mailserverne? Alle tre skal give True
Test-NetConnection mx1.mailpod16-cph3.g1i.one.com -Port 25
Test-NetConnection send.one.com -Port 587
Test-NetConnection imap.one.com -Port 993
```

> ⚠️ Brug **ikke** `Resolve-DnsName -Type CAA` — den record-type findes ikke i Windows
> PowerShell 5.1 og fejler lydløst, så det *ser ud* som om der ingen CAA er. Brug i stedet:
> ```powershell
> (Invoke-RestMethod "https://dns.google/resolve?name=nordiskinstallation.dk&type=CAA").Answer
> ```

> ⚠️ Test ikke port 587 mod `mx1...` — MX-servere lytter kun på port 25, så den fejler altid
> og giver falsk alarm.

**Den definitive test er at sende rigtig mail begge veje** — ud til en Gmail/Outlook-adresse
(tjek `SPF: PASS` under "Vis original") og ind fra en ekstern adresse (tjek også spam-mappen).
Gentag efter 1, 6, 24 og 48 timer. Et grønt resultat efter 15 minutter beviser ingenting.
