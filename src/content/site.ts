/**
 * ALL FARM TEXT LIVES HERE.
 * Edit the words between the quotes, save the file, and the website updates.
 * Do not change the `id` values: the menu links and scroll animations use them.
 */

export const farm = {
  name: 'Hillsbrook Farm',
  brand: "Island Pure Cow's Milk",
  tagline: "Fresh as Bucas Grande's sea breeze.",
  founded: '27 May 2015',
  founder: 'Edelito Caindoy Sangco',
  address: 'Sitio Carbon, Barangay Del Pilar, Socorro, Surigao del Norte 8416, Philippines',
  email: 'hillsbrookfarms@gmail.com',
  phone: '[PLACEHOLDER: phone or Messenger number]',
  facebook: 'https://www.facebook.com/hillsbrookfarm',
  deliveryDay: 'Saturday',
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

export type SectionInfo = {
  id: SectionId
  /** Short label used in menus */
  label: string
  /** Big heading shown on the page */
  title: string
  /** Small text above the heading */
  eyebrow: string
  /** Temporary note shown until the section is built */
  placeholder: string
}

/** The page sections, in the order they appear. */
export const sections: SectionInfo[] = [
  {
    id: 'hero',
    label: 'Home',
    title: "Fresh as Bucas Grande's sea breeze.",
    eyebrow: 'Family-run dairy · Socorro, Surigao del Norte',
    placeholder: 'The 3D farm scene arrives in Phase 3. For now, a spinning cube proves 3D works.',
  },
  {
    id: 'journey',
    label: 'Farm to You',
    title: 'Farm to You',
    eyebrow: 'Our dairy journey',
    placeholder: 'Phase 4: a scroll-driven 3D tour through feed, milking, chilling, bottling and delivery.',
  },
  {
    id: 'family',
    label: 'Our Story',
    title: 'Meet the Family',
    eyebrow: 'The people of Hillsbrook',
    placeholder: 'Phase 5a: Edelito Caindoy Sangco and the Hillsbrook family.',
  },
  {
    id: 'pillars',
    label: 'What We Stand For',
    title: 'What we stand for',
    eyebrow: 'Our pillars',
    placeholder: 'Phase 5b: Freshness, Animal Care, Learning & Community, Island Stewardship.',
  },
  {
    id: 'products',
    label: 'Products',
    title: 'From our farm to your fridge',
    eyebrow: "Island Pure Cow's Milk",
    placeholder: 'Phase 5c: pasteurized and raw milk, with Dapa Port and General Luna prices.',
  },
  {
    id: 'stories',
    label: 'Stories',
    title: 'Farm Stories',
    eyebrow: 'News from the hills',
    placeholder: 'Phase 5d: stories from the farm, starting with our Facebook posts.',
  },
  {
    id: 'visit',
    label: 'Visit Us',
    title: 'Visit & Contact',
    eyebrow: 'Come see the farm',
    placeholder: 'Phase 5e: address, map, Saturday delivery and farm visits.',
  },
  {
    id: 'footer',
    label: 'Contact',
    title: 'Hillsbrook Farm',
    eyebrow: '',
    placeholder: 'Phase 2: full footer with links, socials and contact details.',
  },
]
