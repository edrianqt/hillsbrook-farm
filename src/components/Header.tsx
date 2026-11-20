import { useEffect, useRef, useState } from 'react'
import { farm, links, navLinks, orderButton, ui } from '../content/site'
import { lockScroll } from '../lib/smoothScroll'
import Logo from './Logo'
import LanguagePicker from './LanguagePicker'
import Button from './ui/Button'
import { FacebookIcon, MenuIcon, MessengerIcon } from './ui/icons'

/**
 * Sticky header.
 * - Transparent while you are at the top of the page (over the hero), milk-white once you scroll.
 * - Below 1280px wide the links fold into a hamburger menu.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  // Watch the scroll position to switch the header background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the mobile menu is open: freeze the page, focus the first link, close on Escape
  useEffect(() => {
    lockScroll(open)
    if (!open) return
    firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    // Close the menu if the screen gets wide enough for the desktop links
    const wide = window.matchMedia('(min-width: 1280px)')
    const onWide = () => wide.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      window.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  useEffect(() => () => lockScroll(false), [])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        solid ? 'bg-milk/95 shadow-[0_1px_0_rgb(12_82_71/0.12)] backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#hero" className="rounded-full" onClick={() => setOpen(false)}>
          <Logo size={48} />
          <span className="sr-only">{ui.backToTop}</span>
        </a>

        {/* Desktop links */}
        <nav aria-label={ui.mainMenu} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.target}>
                <a
                  href={`#${link.target}`}
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-[15px] whitespace-nowrap font-medium text-soil transition-colors hover:bg-pasture-50 hover:text-pasture"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguagePicker className="max-sm:hidden" />
          {/* Order button sits in the bar on tablets and up; on phones it lives in the menu */}
          <span className="hidden sm:block">
            <Button href={orderButton.href} icon={<MessengerIcon className="size-4" />}>
              {orderButton.label}
            </Button>
          </span>

          {/* Hamburger (phones and tablets) */}
          <button
            ref={menuButton}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-pasture hover:bg-pasture-50 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? ui.closeMenu : ui.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-pasture/10 bg-milk xl:hidden"
      >
        <nav aria-label={ui.mainMenu} className="px-6 py-8">
          <ul className="space-y-1">
            {navLinks.map((link, i) => (
              <li key={link.target}>
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={`#${link.target}`}
                  onClick={() => setOpen(false)}
                  className="font-display block rounded-xl py-3 text-3xl font-semibold text-pasture hover:text-lagoon-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Button href={orderButton.href} size="lg" icon={<MessengerIcon />} onClick={() => setOpen(false)}>
              {orderButton.label}
            </Button>
            <Button href={links.facebook} variant="secondary" size="lg" icon={<FacebookIcon />}>
              {ui.followFacebook}
            </Button>
          </div>
          <LanguagePicker className="mt-8 sm:hidden" />
          <p className="mt-8 text-sm text-soil-muted">{farm.deliveryNote}.</p>
        </nav>
      </div>
    </header>
  )
}
