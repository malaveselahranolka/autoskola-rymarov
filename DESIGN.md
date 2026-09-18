# Design

Směr: standard kategorie (klasický web autoškoly) v úrovni provedení skoda.cz. Zvoleno uživatelem 18. 9. 2026 po dvou losech experimentálních směrů. Nepřidávat experimenty ani „vtipné“ prvky.

## Tokeny (`style.css` → `:root`)
- Barvy: `--blue #2342c2` (modrá školní Fabie; odkazy, ikony, sekundární CTA), `--blue-deep #111c5a` (ceník, modrá dlaždice, patička), `--yellow #ffd23c` (jen hlavní CTA = telefon, text na ní `--ink`), `--ink #0b1332`, `--ink-2 #454c68`, `--bg #f2f3f7`, `--surface #fff`, `--line #dde1ec`.
- Radiusy: 12 / 20 / 28 px, tlačítka pill. Stíny `--shadow-1..3` modře tónované, vrstvené.
- Easing: `--ease-out cubic-bezier(0.23, 1, 0.32, 1)`; žádné `transition: all`, žádné animace layoutu.

## Typografie
- Archivo (variable, `font-stretch` 100–112 %) na nadpisy, tlačítka, čísla; Onest na text.
- H1 až 5.25rem, tracking −0.035em; text 17px / 1.65, max ~68ch.
- Čeština: za jednopísmennými předložkami/spojkami vždy `&nbsp;`.

## Kompozice
- Hero = zaoblený panel s videem Fabie (jen desktop ≥900px, jinak poster), vlevo dole nadpis + žluté „Zavolat“, vpravo karta „Příští výuka teorie“ (počítá se z lichého ISO týdne, čtvrtek 15:30).
- Jediný autorský pohyb: vstup hero (scale média + postupné vyjetí textu) a dobarvení věty v sekci O nás při scrollu. Sekce jinak neanimují.
- Mobil: spodní lišta Zavolat/Napsat po opuštění hero, skrytá u kontaktu.

## Zakázáno
Eyebrow štítky nad nadpisy, gradientní text, emoji, vymyšlené ceny/recenze/statistiky, skupiny A/C/D, Škoda logo/barvy/font.
