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
  /** [PLACEHOLDER] e.g. 'Monday to Saturday, 8 AM to 4 PM' */
  visitingHours: '[PLACEHOLDER: visiting hours]',
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

/* ------------------------------------------------------------------ */
/* MEET THE FAMILY                                                      */
/* ------------------------------------------------------------------ */
/**
 * Photos: put each photo in public/images/family/ and write its file name in `photo`,
 * e.g. photo: 'images/family/edelito.jpg'. Leave it empty ('') to show the illustrated placeholder.
 * Portrait photos work best (taller than wide), at least 900 px wide.
 */
export const family = {
  eyebrow: 'The people of Hillsbrook',
  title: 'Meet the Family',
  intro: 'Hillsbrook is a family farm. These are the people who look after the herd, the fields and every bottle.',
  members: [
    {
      name: 'Edelito Caindoy Sangco',
      role: 'Founder, proprietor and farm manager',
      quote: "[PLACEHOLDER: Edelito's quote, in his own words: why he started Hillsbrook, or what he loves about the farm]",
      bio: 'Edelito studied Animal Husbandry & Dairying at SNSU–Mainit and started Hillsbrook Farm on 27 May 2015. He also chairs AgriCOOPh Federation and Socorro Empowered Peoples Cooperative.',
      photo: '',
      photoAlt: 'Edelito Caindoy Sangco at Hillsbrook Farm',
      initials: 'ES',
    },
    {
      name: '[PLACEHOLDER: family member name]',
      role: '[PLACEHOLDER: role on the farm]',
      quote: '[PLACEHOLDER: a short quote in their own words]',
      bio: '',
      photo: '',
      photoAlt: '',
      initials: 'H',
    },
    {
      name: '[PLACEHOLDER: family member name]',
      role: '[PLACEHOLDER: role on the farm]',
      quote: '[PLACEHOLDER: a short quote in their own words]',
      bio: '',
      photo: '',
      photoAlt: '',
      initials: 'F',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* WHAT WE STAND FOR (four pillars)                                     */
/* ------------------------------------------------------------------ */
export type PillarIcon = 'bottle' | 'cow' | 'house' | 'leaf'

export const pillars = {
  eyebrow: 'Our pillars',
  title: 'What we stand for',
  items: [
    {
      icon: 'bottle' as PillarIcon,
      title: 'Freshness',
      text: 'Our milk is chilled after milking and bottled here on the farm, then carried across to Siargao every Saturday.',
      link: { label: 'Read more', href: '#journey' },
    },
    {
      icon: 'cow' as PillarIcon,
      title: 'Animal Care',
      text: 'Our five cows and four calves graze on our own hills and eat Napier grass and corn we grow for them. A small herd means every animal gets attention.',
      link: { label: 'Read more', href: '#story-grandkids-visit-the-calves' },
    },
    {
      icon: 'house' as PillarIcon,
      title: 'Learning & Community',
      text: 'Hillsbrook is an ATI-accredited Learning Site on Diversified Farming and a TESDA-accredited Farm School. Our gate is open to visitors, students and fellow farmers.',
      link: { label: 'Read more', href: '#visit' },
    },
    {
      icon: 'leaf' as PillarIcon,
      title: 'Island Stewardship',
      text: 'We farm with the island, not against it: growing our own feed and finding new ways to cope with dry El Niño months.',
      link: { label: 'Read more', href: '#story-coping-with-el-nino' },
    },
  ],
}

/* ------------------------------------------------------------------ */
/* PRODUCTS AND PRICES                                                   */
/* ------------------------------------------------------------------ */
/** Delivery points: the price toggle switches between these. */
export const deliveryPoints = [
  { id: 'dapa', label: 'Dapa Port', note: 'Near the public market' },
  { id: 'gl', label: 'General Luna', note: 'Any drop-off point' },
] as const
export type DeliveryPointId = (typeof deliveryPoints)[number]['id']

export type Product = {
  id: string
  name: string
  container: string
  size: string
  description: string
  /** pet = clear bottle, hdpe = opaque bottle, jug = 10-litre container (for the drawing) */
  art: 'pet' | 'hdpe' | 'jug'
  /** Optional real photo, e.g. 'images/products/pasteurized-pet.jpg'. Leave '' to use the drawing. */
  photo: string
  featured?: boolean
  /** Prices in pesos PER LITRE. Leave a price out (or 0) if it is not sold that way. */
  prices: Record<DeliveryPointId, { retail?: number; wholesale?: number }>
  wholesaleNote?: string
}

export const products = {
  eyebrow: "Island Pure Cow's Milk",
  title: 'From our farm to your fridge',
  intro: 'Fresh milk from our herd, delivered every Saturday. Prices are per litre and depend on where we deliver.',
  /** When the prices below were last updated (shown under the prices) */
  pricesUpdated: '6 October 2026',
  orderLabel: 'Order on Messenger',
  /** The message that opens in Messenger. {product} is replaced with the product name. */
  orderMessage: 'Hi Hillsbrook Farm! I would like to order {product}. Delivery to {place}.',
  items: [
    {
      id: 'pasteurized-pet',
      name: 'Pasteurized milk',
      container: 'PET bottle',
      size: '1 litre',
      description: 'Fresh cow’s milk, pasteurized on the farm, in a clear PET bottle.',
      art: 'pet',
      photo: '',
      featured: true,
      prices: { dapa: { retail: 175, wholesale: 150 }, gl: { retail: 200, wholesale: 175 } },
      wholesaleNote: 'min. 10 bottles',
    },
    {
      id: 'pasteurized-hdpe',
      name: 'Pasteurized milk',
      container: 'HDPE bottle',
      size: '1 litre',
      description: 'The same fresh pasteurized milk in a sturdy, opaque HDPE bottle.',
      art: 'hdpe',
      photo: '',
      prices: { dapa: { retail: 200, wholesale: 175 }, gl: { retail: 225, wholesale: 200 } },
      wholesaleNote: 'min. 10 bottles',
    },
    {
      id: 'raw-1l',
      name: 'Raw whole milk',
      container: 'PET bottle',
      size: '1 litre',
      description: 'Unpasteurized whole cow’s milk, straight from our herd. Keep refrigerated.',
      art: 'pet',
      photo: '',
      prices: { dapa: { retail: 275 }, gl: { retail: 300 } },
    },
    {
      id: 'raw-10l',
      name: 'Raw whole milk',
      container: 'PET container',
      size: '10 litres',
      description: 'Unpasteurized whole milk in bulk, for resort kitchens, cafés and bakers.',
      art: 'jug',
      photo: '',
      prices: { dapa: { wholesale: 250 }, gl: { wholesale: 275 } },
    },
  ] satisfies Product[],
  comingSoon: {
    title: 'Coming soon: yogurt and more',
    text: 'We are working on value-added products made from our own milk. Tell us what you would love to see.',
    cta: 'Tell us on Messenger',
    message: 'Hi Hillsbrook Farm! I would love to see yogurt (or …) from your farm.',
  },
}

/* ------------------------------------------------------------------ */
/* FARM STORIES                                                          */
/* The stories themselves are Markdown files in src/content/stories/.    */
/* ------------------------------------------------------------------ */
export const storiesSection = {
  eyebrow: 'News from the hills',
  title: 'Farm Stories',
  intro: 'Life on the farm, from planting season to visitors at milking time.',
  viewAll: 'View all stories',
  readMore: 'Read more',
}

/* ------------------------------------------------------------------ */
/* VISIT & CONTACT                                                       */
/* ------------------------------------------------------------------ */
export const visit = {
  eyebrow: 'Come see the farm',
  title: 'Visit & Contact',
  intro: 'Order milk, plan a farm visit or bring a group to our learning site. We would love to hear from you.',
  deliveryPoints: ['Dapa Port, near the public market', 'Any drop-off point in General Luna'],
  deliveryDay: 'Once a week, on Saturday',
  visits: 'Farm visits are welcome.',
  groups: 'Groups and schools can visit our ATI-accredited Learning Site on Diversified Farming and TESDA-accredited Farm School. Message us to arrange a date.',
  howToGetHere: [
    'By boat from Surigao City to Socorro.',
    'By boat from Hayanggabon Port in Claver, Surigao del Norte.',
    'From Siargao, by boat from Dapa.',
    'From Socorro town, message us and we will guide you to Barangay Del Pilar.',
  ],
  map: {
    /** [PLACEHOLDER] Replace with your exact Google Maps pin link (Share → Copy link) */
    link: 'https://www.google.com/maps/search/?api=1&query=Barangay+Del+Pilar,+Socorro,+Surigao+del+Norte',
    /** What the embedded map searches for. Replace with your farm's exact coordinates, e.g. '9.62,125.95' */
    query: 'Barangay Del Pilar, Socorro, Surigao del Norte, Philippines',
  },
}

/**
 * Contact form. While `endpoint` is empty, "Send" opens the visitor's email app with the message
 * already written. Once a form service is chosen, paste its address here (e.g. a Formspree form URL).
 */
export const contactForm = {
  endpoint: '',
  to: farm.email,
  topics: ['Order milk', 'Farm visit', 'Group or school visit', 'Something else'],
}
