# DNS-baseline — før ændringer

Optaget **2026-07-31** via offentligt DNS-opslag (Cloudflare resolver 1.1.1.1), mens begge domæner
lå hos One.com med One.coms navneservere.

Formålet med denne fil: hvis mail eller hjemmeside går i stykker efter en DNS-ændring, kan
tilstanden herunder gendannes 1:1.

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

> ⚠️ **`p=reject` gør SPF-recorden kritisk.** DMARC står på "reject", så hvis SPF-recorden
> mangler eller er forkert efter en flytning, bliver udgående mail **afvist** af modtagerne
> (Gmail, Outlook m.fl.) — ikke blot spam-markeret. Kopiér SPF-linjen tegn for tegn.

> ⚠️ Hvis records flyttes til Cloudflare: MX og alle mail-TXT skal stå som **"DNS only" (grå sky)**,
> aldrig proxied (orange sky). Proxying af en MX-record ødelægger mailmodtagelse.

### Web-records — disse er dem vi ændrer

| Type | Navn | Værdi | TTL |
|------|------|-------|-----|
| A | `@` | `46.30.211.38` | 600 |
| A | `www` | `46.30.211.38` | — |

`46.30.211.38` er One.coms webhotel-IP. Det er de to records der skal pege mod den nye
hosting i stedet.

### Navneservere

| Type | Værdi |
|------|-------|
| NS | `ns01.one.com` |
| NS | `ns02.one.com` |

SOA serial ved optagelse: `2026073113`

### Ikke fundet (fandtes ikke på optagelsestidspunktet)

`www` CNAME · `mail` · `autodiscover` · `autoconfig` · `_autodiscover._tcp` SRV ·
DKIM på selektorerne `one`, `default`, `onecom`

> Bemærk: DKIM kan ligge på en selektor der ikke blev gættet. Tjek One.coms kontrolpanel
> for en DKIM-indstilling før flytning, hvis du vil være helt sikker.

---

## nordiskinstallation.com — SKAL BARE REDIRECTE

| Type | Navn | Værdi |
|------|------|-------|
| NS | `@` | `ns01.one.com`, `ns02.one.com` |
| A | `@` | `46.30.211.38` |
| A | `www` | `46.30.211.38` |
| MX | `@` | `.` (prioritet 0) |
| TXT | `@` | ingen |

> 🟢 **`MX = "." med prioritet 0` er en "null MX" (RFC 7505)** — en bevidst erklæring om at
> domænet **ikke** modtager mail. Der er altså ingen mail at miste på `.com`, og domænet kan
> trygt flyttes og bruges til redirect.

SOA serial ved optagelse: `2026073102`

---

## Sådan gentager du opslaget

Kør i PowerShell for at sammenligne med nuværende tilstand:

```powershell
Resolve-DnsName nordiskinstallation.dk -Type MX -Server 1.1.1.1
Resolve-DnsName nordiskinstallation.dk -Type TXT -Server 1.1.1.1
Resolve-DnsName _dmarc.nordiskinstallation.dk -Type TXT -Server 1.1.1.1
```
