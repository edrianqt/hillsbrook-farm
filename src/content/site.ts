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

/** The page sections, in the order they appear. Intros marked [PLACEHOLDER] get real content in Phases 3–5. */
export const sections: SectionInfo[] = [
  {
    id: 'hero',
    eyebrow: 'Family-run dairy · Socorro, Surigao del Norte',
    title: "Fresh as Bucas Grande's sea breeze.",
    intro:
      "Island Pure Cow's Milk from our family farm on the hills of Barangay Del Pilar, Socorro. Maayong pag-abot! Welcome to Hillsbrook.",
  },
  {
    id: 'journey',
    eyebrow: 'Our dairy journey',
    title: 'Farm to You',
    intro:
      '[PLACEHOLDER] From the Napier grass on our hills to your breakfast table in Siargao: follow a bottle of Island Pure milk. (3D scroll tour comes in Phase 4.)',
  },
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
