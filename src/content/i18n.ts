/**
 * Language switch: English (written in site.ts), Bisaya and Filipino.
 *
 * The translations in lang/ceb.ts and lang/fil.ts only list the words that change. When the
 * language changes, the page's content objects are refilled in place (English first, then the
 * translation on top), so every component shows the new words on its next render.
 * The longer farm stories stay in English.
 */
import { useSyncExternalStore } from 'react'
import * as site from './site'
import ceb from './lang/ceb'
import fil from './lang/fil'

export type Lang = 'en' | 'ceb' | 'fil'
export const LANGUAGES: { id: Lang; label: string; htmlLang: string }[] = [
  { id: 'en', label: 'English', htmlLang: 'en' },
  { id: 'ceb', label: 'Bisaya', htmlLang: 'ceb' },
  { id: 'fil', label: 'Filipino', htmlLang: 'fil' },
]

// the content objects the page reads (all are changed in place, never replaced)
const live = {
  farm: site.farm,
  orderButton: site.orderButton,
  navLinks: site.navLinks,
  footerLinks: site.footerLinks,
  heroContent: site.heroContent,
  journey: site.journey,
  family: site.family,
  pillars: site.pillars,
  deliveryPoints: site.deliveryPoints,
  products: site.products,
  storiesSection: site.storiesSection,
  visit: site.visit,
  contactForm: site.contactForm,
  recognition: site.recognition,
  faq: site.faq,
  orderForm: site.orderForm,
  hotspots: site.hotspots,
  ui: site.ui,
} as Record<string, unknown>

export type Translation = { [K in keyof typeof live]?: unknown }

const english = structuredClone(live)
const dictionaries: Record<Lang, Translation> = { en: {}, ceb, fil }

type Bag = Record<string, unknown>
const isObj = (v: unknown): v is Bag => typeof v === 'object' && v !== null

/** Copies `source` onto `target` key by key (arrays item by item), keeping `target`'s identity. */
function fill(target: Bag | unknown[], source: Bag | unknown[]) {
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue
    const t = target as Bag
    if (isObj(value) && isObj(t[key])) fill(t[key] as Bag, value)
    else t[key] = value
  }
}

let current: Lang = 'en'
const listeners = new Set<() => void>()

export function setLanguage(lang: Lang) {
  for (const key of Object.keys(live)) {
    const target = live[key] as Bag
    fill(target, structuredClone(english[key]) as Bag)
    const t = dictionaries[lang][key as keyof Translation]
    if (isObj(t)) fill(target, t)
  }
  current = lang
  document.documentElement.lang = LANGUAGES.find((l) => l.id === lang)!.htmlLang
  try {
    localStorage.setItem('hillsbrook-lang', lang)
  } catch {
    /* private browsing: the choice just isn't remembered */
  }
  listeners.forEach((fn) => fn())
}

/** Language saved from an earlier visit (or English). Call once before the first render. */
export function restoreLanguage() {
  let saved: string | null = null
  try {
    saved = localStorage.getItem('hillsbrook-lang')
  } catch {
    saved = null
  }
  if (saved === 'ceb' || saved === 'fil') setLanguage(saved)
}

/** The current language; components that call this re-render when it changes. */
export function useLanguage() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => current,
  )
}
