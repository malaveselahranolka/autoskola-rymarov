# Autoškola Rýmařov

Moderní responzivní webová prezentace autoškoly Rýmařov. Redesign původního webu [autoskola-rymarov.webnode.cz](https://autoskola-rymarov.webnode.cz/).

## Funkce

- Responzivní one-page web (mobil první), spodní lišta pro rychlé zavolání na mobilu
- Hero s videem výukového vozu (jen desktop, jinak poster kvůli datům)
- Automaticky spočítaný termín příští výuky teorie (lichý týden, čtvrtek 15:30)
- Sekce: O nás, Proč u nás, Kurzy, Jak to probíhá, Instruktor, Ceník, Kontakt
- Kontaktní formulář s validací (odesílá přes `mailto:`), předvyplnění kurzu z karet
- Přístupnost: skip link, landmarky, focus stavy, `prefers-reduced-motion`
- Design pravidla v `DESIGN.md`, produktová fakta v `PRODUCT.md`

## Technologie

- HTML5
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (žádné frameworky)
- Google Fonts (Archivo, Onest)

## Spuštění

Projekt je statický, stačí otevřít `index.html` v prohlížeči, nebo spustit lokální server:

```bash
npx serve -l 3000 .
```

Otevřete `http://localhost:3000`.

## Struktura

```
autoskola/
├── index.html    # Hlavní HTML soubor
├── style.css     # Styly
├── script.js     # JS logika (menu, animace, formulář)
└── README.md
```

## Kontakt

- Telefon: 604 305 733
- E-mail: ladislav.mikus@seznam.cz
- Adresa: Areál ČSAD Rýmařov, ul. Žižkova 620/21, 795 01 Rýmařov
