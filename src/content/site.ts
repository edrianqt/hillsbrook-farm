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
  /** Shown as text and used for the "Call us" link (from the farm's Facebook post, May 2026) */
  phone: '+63 908 884 2056',
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
  | 'faq'
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
  { label: 'Questions', target: 'faq' },
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
    'Illustration of Hillsbrook Farm at golden hour: green hills with a cow shed, a milking parlor, coconut palms, a wide Napier grass field and a separate cornfield on the hillside, the grown cows in one fenced pen and the calves in their own pen with a shade roof, and the turquoise sea with limestone islets of Bucas Grande behind.',
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
      body: 'We grow our own feed on the hills of Barangay Del Pilar: a big field of Napier grass and a separate cornfield, right beside the pen of our crossbred Holstein Friesian cows.',
      detail: '',
      image: 'images/farm/planting-napier.jpg',
      imageAlt: 'Two farmers planting rows of Napier grass cuttings in red soil, with the cow shed behind them.',
    },
    {
      label: 'Milking',
      title: 'Milked with care',
      body: 'Each cow steps into her stall in our Milking Parlor, where she is milked gently, without rush.',
      detail: '[PLACEHOLDER: your milking routine and times, e.g. "twice a day, at 5 AM and 4 PM"]',
      image: 'images/farm/herd-in-cow-shed.jpg',
      imageAlt: 'Black-and-white Holstein Friesian cows at the feeding trough in the Hillsbrook cow shed, with two farmers in front.',
    },
    {
      label: 'Processing',
      title: 'Pasteurized and cooled',
      body: 'Milk for our pasteurized products goes into our 100-litre line: the pasteurizer heats it, the homogenizer keeps the cream evenly mixed, and the cooling tank chills it fast.',
      detail: '[PLACEHOLDER: your cooling process, e.g. "chilled to 4 °C within 30 minutes"]',
      image: 'images/journey-3.jpg',
      imageAlt: 'Our 100-litre milk processing line beside the milking parlor: a pasteurization machine, a homogenizer and a cooling tank on one stainless steel frame.',
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
  /** A photo of the whole family, shown under the profiles */
  groupPhoto: 'images/farm/family.jpg',
  groupPhotoAlt: 'The Sangco family together outdoors: Edelito in the centre with his children, their spouses and his grandchildren, all dressed in beige.',
  groupCaption: 'Three generations of the Sangco family. The grandchildren grow up around the herd, learning where milk comes from.',
  members: [
    {
      name: 'Edelito Caindoy Sangco',
      role: 'Founder, proprietor and farm manager',
      quote: "[PLACEHOLDER: Edelito's quote, in his own words: why he started Hillsbrook, or what he loves about the farm]",
      bio: 'Edelito studied Animal Husbandry & Dairying at SNSU–Mainit and started Hillsbrook Farm on 27 May 2015. He also chairs AgriCOOPh Federation and Socorro Empowered Peoples Cooperative.',
      photo: 'images/farm/edelito.jpg',
      photoAlt: 'Portrait of Edelito Caindoy Sangco wearing a barong',
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
      text: 'Our herd lives in a modern cow shed with automatic water troughs, anti-slip floors and roof louvers for fresh air, plus an open loafing area to rest and move freely. They eat Napier grass and corn we grow for them.',
      link: { label: 'Read more', href: '#story-new-cow-shed-ready' },
    },
    {
      icon: 'house' as PillarIcon,
      title: 'Learning & Community',
      text: 'Hillsbrook is an ATI-accredited Learning Site on Diversified Farming and a TESDA-accredited Farm School. In 2026 we hosted a hygienic milk production training for 53 Socorro farmers, and our gate is open to visitors.',
      link: { label: 'Read more', href: '#visit' },
    },
    {
      icon: 'leaf' as PillarIcon,
      title: 'Island Stewardship',
      text: 'We aim for climate-smart, nature-positive dairy: growing our own feed, planting trees with our guests, and finding new ways to cope with dry El Niño months.',
      link: { label: 'Read more', href: '#story-first-farm-tourists' },
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
  /** label colour in the drawing (default: Island Pure yellow) */
  flavour?: 'plain' | 'raw' | 'chocolate' | 'ube'
  /** Litres in one bottle or container (used to work out the order total). Leave out if not known yet. */
  litres?: number
  /** Optional real photo, e.g. 'images/products/pasteurized-pet.jpg'. Leave '' to use the drawing. */
  photo: string
  featured?: boolean
  /** Prices in pesos PER LITRE. Leave a price out (or 0) if it is not sold that way; leave both out to show "Ask for price". */
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
      litres: 1,
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
      litres: 1,
      art: 'hdpe',
      photo: 'images/products/pasteurized-bottles.jpg',
      prices: { dapa: { retail: 200, wholesale: 175 }, gl: { retail: 225, wholesale: 200 } },
      wholesaleNote: 'min. 10 bottles',
    },
    {
      id: 'raw-1l',
      name: 'Raw whole milk',
      container: 'PET bottle',
      size: '1 litre',
      description: 'Unpasteurized whole cow’s milk, straight from our herd. Keep refrigerated.',
      litres: 1,
      art: 'pet',
      flavour: 'raw',
      photo: '',
      prices: { dapa: { retail: 275 }, gl: { retail: 300 } },
    },
    {
      id: 'raw-10l',
      name: 'Raw whole milk',
      container: 'PET container',
      size: '10 litres',
      description: 'Unpasteurized whole milk in bulk, for resort kitchens, cafés and bakers.',
      litres: 10,
      art: 'jug',
      photo: '',
      flavour: 'raw',
      prices: { dapa: { wholesale: 250 }, gl: { wholesale: 275 } },
    },
    {
      id: 'chocolate',
      name: 'Chocolate milk',
      container: 'Bottle',
      size: '[PLACEHOLDER: size]',
      description: 'Our fresh cow’s milk with chocolate. We shared it with runners at the Bucas Grande Half Marathon.',
      art: 'pet',
      flavour: 'chocolate',
      photo: 'images/products/chocolate.jpg',
      prices: { dapa: {}, gl: {} },
    },
    {
      id: 'ube',
      name: 'Ube milk',
      container: 'Bottle',
      size: '[PLACEHOLDER: size]',
      description: 'Fresh cow’s milk with ube, the purple yam loved all over the Philippines.',
      art: 'pet',
      flavour: 'ube',
      photo: 'images/products/ube.jpg',
      prices: { dapa: {}, gl: {} },
    },
  ] satisfies Product[],
  /** Shops that sell Island Pure (from our announcement of 6 July 2026) */
  stockists: [
    {
      name: "Sante's Meat Shop",
      address: 'Borromeo St. corner Diez St., Barangay Taft, Surigao City (beside the original public market site)',
      products: 'Pure pasteurized whole milk and choco milk',
    },
  ],
  /** A real review from a customer (posted on Facebook, 10 September 2026) */
  review: {
    quote: 'Island fresh milk from Hillsbrook Farm so good!',
    name: 'Caye Simpoo',
    place: 'General Luna, Siargao',
  },
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

/* ------------------------------------------------------------------ */
/* RECOGNISED BY (shown under "What we stand for")                      */
/* ------------------------------------------------------------------ */
/** Names only: add official logos here later only with each agency's permission. */
export const recognition = {
  title: 'Recognised and supported by',
  items: [
    { short: 'ATI', text: 'Accredited Learning Site on Diversified Farming', org: 'Agricultural Training Institute' },
    { short: 'TESDA', text: 'Accredited Farm School', org: 'Technical Education and Skills Development Authority' },
    { short: 'NDA', text: 'Partner farm, Dairy Herd Build-Up Program', org: 'National Dairy Authority' },
    { short: 'PCA', text: 'Cow shed funded through the CFIDP', org: 'Philippine Coconut Authority' },
    { short: 'DOST', text: 'Food safety training for dairy farmers', org: 'Department of Science and Technology' },
  ],
}

/* ------------------------------------------------------------------ */
/* FREQUENTLY ASKED QUESTIONS                                           */
/* ------------------------------------------------------------------ */
export const faq = {
  eyebrow: 'Good to know',
  title: 'Questions about our milk',
  intro: 'The things people ask us most. Anything else? Send us a message.',
  items: [
    {
      q: 'What is the difference between raw and pasteurized milk?',
      a: 'Pasteurized milk is heated in our 100-litre pasteurizer to kill harmful germs, then cooled quickly. Raw milk comes straight from our cows, filtered and chilled, with nothing taken out. Raw milk can carry germs, so we recommend boiling it before drinking, and choosing pasteurized milk for children, pregnant women, older people and anyone who is often sick.',
    },
    {
      q: 'How should I keep the milk, and how long does it last?',
      a: 'Keep it in the fridge at 4 °C or colder and close the cap after pouring. Pasteurized milk keeps for [PLACEHOLDER: number of days] days and raw milk for [PLACEHOLDER: number of days] days once it reaches you. On raw milk the cream rises to the top: just shake the bottle.',
    },
    {
      q: 'When and where do you deliver?',
      a: 'Every Saturday, at Dapa Port near the public market and at any drop-off point in General Luna, Siargao. In Surigao City you can buy our pasteurized whole milk and choco milk at Sante’s Meat Shop.',
    },
    {
      q: 'How do I pay?',
      a: '[PLACEHOLDER: payment methods, e.g. "Cash on delivery or GCash to 0908 884 2056"]',
    },
    {
      q: 'Do you take back empty bottles?',
      a: '[PLACEHOLDER: bottle return policy, e.g. "Yes. Rinse them and hand them back on delivery day."]',
    },
    {
      q: 'Do you sell wholesale to resorts and cafés?',
      a: 'Yes. Wholesale prices start at 10 bottles, and our 10-litre raw milk container is made for resort kitchens, cafés and bakers. See the prices above, or message us for a regular weekly order.',
    },
    {
      q: 'Can we visit the farm?',
      a: 'Yes, farm visits are welcome. Groups and schools can also visit our ATI-accredited Learning Site and TESDA-accredited Farm School. Message us first to arrange a date. Entrance fee: [PLACEHOLDER: fee, or "free"].',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* ORDER FORM ("Order for Saturday", in the Products section)          */
/* ------------------------------------------------------------------ */
export const orderForm = {
  title: 'Order for Saturday',
  intro: 'Pick your milk and quantities. We put your order into one message for you to send on Messenger, by text or by email.',
  /** [PLACEHOLDER] Last day to order for Saturday, e.g. 'Thursday, 6 PM'. Leave '' to hide. */
  cutoff: '',
  deliveryFor: 'Delivery on',
  orderBy: 'Order by',
  quantity: 'Quantity',
  less: 'One less',
  more: 'One more',
  name: 'Your name',
  phone: 'Mobile number',
  spot: 'Drop-off spot (optional)',
  spotHint: 'e.g. the resort or landmark in General Luna',
  notes: 'Notes (optional)',
  summary: 'Your order',
  empty: 'Add at least one item to see your order.',
  total: 'Estimated total',
  toConfirm: 'price to confirm',
  wholesaleApplied: 'wholesale price',
  totalNote: 'We confirm the final total when we reply.',
  sendMessenger: 'Copy and open Messenger',
  copied: 'Copied! Paste it in the chat with us.',
  sendText: 'Send by text',
  sendEmail: 'Send by email',
  /** {date} is replaced with the delivery Saturday */
  greeting: 'Hi Hillsbrook Farm! Here is my order for {date}:',
  dropOff: 'Drop-off',
  nameLabel: 'Name',
  phoneLabel: 'Mobile',
  notesLabel: 'Notes',
  thanks: 'Thank you!',
}

/* ------------------------------------------------------------------ */
/* CLICKABLE PLACES IN THE 3D FARM (top of the page)                    */
/* ------------------------------------------------------------------ */
export type HotspotId = 'shed' | 'parlor' | 'gate' | 'house' | 'fields' | 'calves'
export const hotspots: { hint: string; items: Record<HotspotId, { name: string; action: string; href: string }> } = {
  hint: 'Click a building to learn more',
  items: {
    shed: { name: 'Cow Shed', action: 'Read about our new cow shed', href: '#story-new-cow-shed-ready' },
    parlor: { name: 'Milking Parlor', action: 'See how our milk gets to you', href: '#journey' },
    gate: { name: 'Farm gate', action: 'Plan your visit', href: '#visit' },
    house: { name: 'Our farmhouse', action: 'Meet the family', href: '#family' },
    fields: { name: 'Napier grass and corn', action: 'Read how we grow our own feed', href: '#story-planting-napier-and-corn' },
    calves: { name: 'Calf pen', action: 'Read about the grandkids’ visit', href: '#story-grandkids-visit-the-calves' },
  },
}

/* ------------------------------------------------------------------ */
/* SMALL WORDS USED AROUND THE PAGE (buttons, labels)                   */
/* ------------------------------------------------------------------ */
export const ui = {
  language: 'Language',
  backToTop: ' (back to top)',
  mainMenu: 'Main',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  followFacebook: 'Follow us on Facebook',
  newTab: '(opens in a new tab)',
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  journeySteps: 'Farm to You steps',
  familyMembers: 'Family members',
  familyMember: 'Family member',
  roleToAdd: 'Role to add',
  photoComingSoon: 'Photo coming soon',
  askPrice: 'Ask us for the price on Messenger',
  retail: 'Retail',
  wholesale: 'Wholesale',
  perLitre: ' / litre',
  deliveryTo: 'Delivery to',
  showingPricesFor: 'Showing prices for delivery to',
  favourite: 'Our favourite',
  comingSoon: 'Coming soon',
  onFacebook: '(on Facebook)',
  alsoInSurigao: 'Also in Surigao City',
  pricesUpdated: 'Prices per litre, updated',
  gateAlt: 'The Hillsbrook Farm gate with its welcome banner',
  showMap: 'Show the map',
  loadsMaps: 'Loads Google Maps',
  delivery: 'Delivery',
  farmVisits: 'Farm visits',
  hours: 'Hours',
  messageUs: 'Message us',
  callUs: 'Call us',
  facebook: 'Facebook',
  howToGetHere: 'How to get here',
  openInMaps: 'Open in Google Maps',
  formTitle: 'Send us a message',
  formName: 'Your name',
  formContact: 'Email or mobile number',
  formTopic: 'What is it about?',
  formMessage: 'Message',
  formSend: 'Send message',
  formSending: 'Sending…',
  formSent: 'Thank you! Your message has been sent.',
  formError: 'Sorry, that did not send. Please message us on Messenger instead.',
  formOpenedEmail: 'Your email app should open with the message ready. Just press send.',
  quickLinks: 'Quick links',
  findUs: 'Find us',
  socialMedia: 'Social media',
  storyNotFound: 'Story not found',
  storyMoved: 'This story may have moved. Have a look at all our stories instead.',
  tasteTheMilk: 'Taste the milk from this farm.',
  moreFromFarm: 'More from the farm',
  storiesInEnglish: '',
}
