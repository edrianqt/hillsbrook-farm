# Hillsbrook Farm website

A 3D website for Hillsbrook Farm and Island Pure Cow's Milk, Socorro, Surigao del Norte.

## Run it on your computer

1. Install Node.js (LTS version) from https://nodejs.org
2. Open a terminal in this folder and run:

```bash
npm install     # first time only: downloads the libraries
npm run dev     # starts the site; open the http://localhost:5173 link it prints
```

Stop it with `Ctrl + C`.

Other commands:

```bash
npm run build    # makes the final, optimised website in the dist/ folder
npm run preview  # shows that final build at http://localhost:4173
```

## Where things live

| What | Where |
| --- | --- |
| All farm text (names, prices, addresses) | `src/content/site.ts` |
| Page sections (header, products, etc.) | `src/components/` |
| 3D hero scene (put together here) | `src/three/HeroScene.tsx` |
| 3D farm parts: hills, sea, sky, buildings, cows, plants, fence, camera | `src/three/hero/` |
| Where cows, plots and buildings stand | `src/three/hero/world.ts` |
| "Farm to You" scroll journey (cards, dots, scrolling) | `src/components/Journey.tsx` |
| Journey 3D: camera route, sunrise→midday light | `src/three/JourneyScene.tsx` |
| Journey props: bottles, bottling table, bangka, Siargao shore | `src/three/journey/` |
| Journey station pictures (reduced-motion version) | `public/images/journey-1.jpg` … `journey-5.jpg` |
| Still pictures shown while 3D loads (or instead of it) | `public/images/hero-fallback.jpg`, `hero-fallback-mobile.jpg` |
| Smooth scrolling + scroll animation setup | `src/lib/smoothScroll.ts` |
| Photos | `public/images/` |
| 3D model files (.glb) | `public/models/` |

## Adding a farm story

1. Copy any file in `src/content/stories/` (for example `planting-napier-and-corn.md`).
2. Rename it: the file name becomes the story's web address (`#story-your-file-name`). Use lowercase words and hyphens.
3. Change the lines between the `---` markers: `title`, `category`, `date` (YYYY-MM-DD), `excerpt`, `image`, `imageAlt`, and `featured: true` if it should appear on the home page.
4. Write the story below the second `---`. Blank lines start new paragraphs, `**bold**` makes bold text.
5. Lines like `[photo: …]` or `[details: …]` show as yellow "to add" boxes until you replace them.

## Where the rest of the content lives (`src/content/site.ts`)

| Section | Look for |
| --- | --- |
| Meet the Family (names, roles, quotes, photos) | `family` |
| What we stand for | `pillars` |
| Products and prices (per litre, Dapa Port / General Luna) | `products` |
| Visit & Contact, map pin, how to get here | `visit` |
| Contact form service address | `contactForm.endpoint` |

## Tools used

Vite, React, TypeScript, Three.js (@react-three/fiber, @react-three/drei), GSAP ScrollTrigger, Lenis, Tailwind CSS.
