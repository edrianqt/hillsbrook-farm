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
| 3D scenes | `src/three/` |
| Smooth scrolling + scroll animation setup | `src/lib/smoothScroll.ts` |
| Photos | `public/images/` |
| 3D model files (.glb) | `public/models/` |

## Tools used

Vite, React, TypeScript, Three.js (@react-three/fiber, @react-three/drei), GSAP ScrollTrigger, Lenis, Tailwind CSS.
