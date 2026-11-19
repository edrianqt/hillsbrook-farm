/**
 * ALL FARM TEXT LIVES HERE.
 * Edit the words between the quotes, save the file, and the website updates.
 * Anything marked [PLACEHOLDER] still needs real information from you.
 * Do not change the `id` values: the menu links and scroll animations use them.
 */

export const farm = {
  name: 'Hillsbrook Farm',
  brand: "Island Pure Cow's Milk",
  tagline: "Fresh as Bucas Grande's sea breeze.",
  /** One or two sentences for the footer, under the logo */
  footerBlurb:
    'A family-owned dairy farm on the hills of Barangay Del Pilar, Socorro, where a brook runs through the pasture. A place where farming is pleasing.',
  founded: '27 May 2015',
  founder: 'Edelito Caindoy Sangco',
  address: {
    line1: 'Sitio Carbon, Barangay Del Pilar',
    line2: 'Socorro, Surigao del Norte 8416',
    country: 'Philippines',
  },
  email: 'hillsbrookfarms@gmail.com',
  /** [PLACEHOLDER] Shown as text and used for the "Call us" link. Write it like +63 9XX XXX XXXX */
  phone: '[PLACEHOLDER: +63 9XX XXX XXXX]',
  deliveryNote: 'Delivery every Saturday to Dapa Port and General Luna, Siargao',
  visitNote: 'Farm visits welcome. ATI Learning Site and TESDA Farm School.',
}

/** Links to your online pages. */
export const links = {
  facebook: 'https://www.facebook.com/hillsbrookfarm',
  /** [PLACEHOLDER: please confirm] Opens a Messenger chat with your page */
  messenger: 'https://m.me/hillsbrookfarm',
}

/** The main "order" button in the header, menu and footer. */
export const orderButton = {
  label: 'Message us to order',
  href: links.messenger,
}

export type SectionId =
  | 'hero'
  | 'journey'
  | 'family'
  | 'pillars'
  | 'products'
  | 'stories'
  | 'visit'
  | 'footer'

/** Header menu, in the order it appears. `target` is the section it scrolls to. */
export const navLinks: { label: string; target: SectionId }[] = [
  { label: 'Our Story', target: 'family' },
  { label: 'Farm to You', target: 'journey' },
  { label: 'Products', target: 'products' },
  { label: 'Visit Us', target: 'visit' },
  { label: 'Stories', target: 'stories' },
]

/** Footer "Quick links" list. */
export const footerLinks: { label: string; target: SectionId }[] = [
  { label: 'Our Story', target: 'family' },
  { label: 'Farm to You', target: 'journey' },
  { label: 'What We Stand For', target: 'pillars' },
  { label: 'Products & Prices', target: 'products' },
  { label: 'Farm Stories', target: 'stories' },
  { label: 'Visit & Contact', target: 'visit' },
]

export type SectionInfo = {
  id: SectionId
  /** Big heading shown on the page */
  title: string
  /** Small label above the heading */
  eyebrow: string
  /** Short paragraph under the heading */
  intro: string
}

/** The big opening section with the 3D farm. */
export const heroContent = {
  eyebrow: 'Family-run dairy · Socorro, Surigao del Norte',
  title: "Fresh as Bucas Grande's sea breeze.",
  subline: "Island Pure Cow's Milk from our family farm on the hills of Barangay Del Pilar, Socorro.",
  journeyButton: 'See the farm journey',
  scrollHint: 'Scroll to explore',
  cowTip: 'Tip: hover over or tap a cow',
  /** Describes the farm picture for visitors who use screen readers */
  imageAlt:
    'Illustration of Hillsbrook Farm at golden hour: green hills with a cow shed, a milking parlor, coconut palms, Napier grass and a young cornfield, black-and-white cows and calves in a fenced pasture, and the turquoise sea with limestone islets of Bucas Grande behind.',
}

/** "Farm to You": the scroll journey, one entry per station, in order. */
export const journey = {
  eyebrow: 'Farm to You',
  title: 'From our hills to your table',
  intro: 'Scroll to follow a bottle of Island Pure milk, from sunrise on the farm to breakfast in Siargao.',
  stations: [
    {
      label: 'Feed',
      title: 'Grown on our own hills',
      body: 'Our crossbred Holstein Friesian cows graze beside the Napier grass and corn we plant ourselves as feed, on the hills of Barangay Del Pilar.',
      detail: '',
      image: 'images/journey-1.jpg',
      imageAlt: 'Cows grazing in the pasture at sunrise, beside rows of young corn and tall Napier grass.',
    },
    {
      label: 'Milking',
      title: 'Milked with care',
      body: 'Each cow steps into her stall in our Milking Parlor, where she is milked gently, without rush.',
      detail: '[PLACEHOLDER: your milking routine and times, e.g. "twice a day, at 5 AM and 4 PM"]',
      image: 'images/journey-2.jpg',
      imageAlt: 'Two black-and-white cows standing in their stalls inside the milking parlor.',
    },
    {
      label: 'Chilling',
      title: 'Cooled within minutes',
      body: 'Fresh milk goes straight into our stainless steel tank to be chilled and kept cold.',
      detail: '[PLACEHOLDER: your cooling process, e.g. "chilled to 4 °C within 30 minutes"]',
      image: 'images/journey-3.jpg',
      imageAlt: 'The stainless steel milk cooling tank beside the milking parlor, lit with a cool blue glow.',
    },
    {
      label: 'Bottling',
      title: 'Pasteurized or pure raw',
      body: "We bottle Island Pure Cow's Milk at the farm: pasteurized milk in PET or HDPE bottles, and raw whole milk for those who prefer it.",
      detail: '[PLACEHOLDER: how you pasteurize, e.g. "heated to 63 °C for 30 minutes, then cooled"]',
      image: 'images/journey-4.jpg',
      imageAlt: 'A steel bottling table with a bottle being filled, rows of Island Pure bottles and green delivery crates.',
    },
    {
      label: 'To your table',
      title: 'Across the water to Siargao',
      body: 'Every Saturday a bangka carries the bottles across to Dapa Port and on to General Luna, to resort kitchens and family breakfast tables.',
      detail: '',
      image: 'images/journey-5.jpg',
      imageAlt: 'A breakfast table on a resort deck in Siargao with pandesal, mango and a glass of milk, the bangka tied up at the pier.',
    },
  ],
}

/** The page sections below the hero, in the order they appear. Intros marked [PLACEHOLDER] get real content in Phases 3–5. */
export const sections: SectionInfo[] = [
  {
    id: 'family',
    eyebrow: 'The people of Hillsbrook',
    title: 'Meet the Family',
    intro:
      '[PLACEHOLDER] Hillsbrook was founded on 27 May 2015 by Edelito Caindoy Sangco, who studied Animal Husbandry & Dairying. Family profiles and quotes come in Phase 5.',
  },
  {
    id: 'pillars',
    eyebrow: 'Our pillars',
    title: 'What we stand for',
    intro: '[PLACEHOLDER] Freshness, Animal Care, Learning & Community, and Island Stewardship. (Phase 5.)',
  },
  {
    id: 'products',
    eyebrow: "Island Pure Cow's Milk",
    title: 'From our farm to your fridge',
    intro:
      '[PLACEHOLDER] Pasteurized milk in PET and HDPE bottles, and raw whole milk, with Dapa Port and General Luna prices. (Phase 5.)',
  },
  {
    id: 'stories',
    eyebrow: 'News from the hills',
    title: 'Farm Stories',
    intro: '[PLACEHOLDER] Stories from the farm, starting with our Facebook posts. (Phase 5.)',
  },
  {
    id: 'visit',
    eyebrow: 'Come see the farm',
    title: 'Visit & Contact',
    intro: '[PLACEHOLDER] Address, map, Saturday delivery and farm visits. (Phase 5.)',
  },
]
