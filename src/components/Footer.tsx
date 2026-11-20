import { farm, footerLinks, links, orderButton, ui } from '../content/site'
import Logo from './Logo'
import Button from './ui/Button'
import { FacebookIcon, MailIcon, MessengerIcon, PhoneIcon, PinIcon } from './ui/icons'

const linkClass = 'inline-flex min-h-11 items-center underline-offset-4 hover:text-white hover:underline'

/** Dark green footer: logo and tagline, quick links, contact details, social icons, copyright. */
export default function Footer() {
  const year = new Date().getFullYear()
  const phoneDigits = farm.phone.replace(/[^\d+]/g, '')

  return (
    <footer id="footer" tabIndex={-1} className="bg-pasture-deep text-mist">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <Logo size={72} tone="dark" />
          <p className="font-display mt-6 text-2xl font-semibold text-milk">{farm.tagline}</p>
          <p className="mt-3 max-w-sm leading-relaxed">{farm.footerBlurb}</p>
          <div className="mt-6">
            <Button href={orderButton.href} variant="light" icon={<MessengerIcon className="size-4" />}>
              {orderButton.label}
            </Button>
          </div>
        </div>

        {/* Quick links */}
        <nav aria-labelledby="footer-links-title">
          <h2 id="footer-links-title" className="font-sans text-sm font-semibold text-cream">
            {ui.quickLinks}
          </h2>
          <ul className="mt-2">
            {footerLinks.map((link) => (
              <li key={link.target}>
                <a href={`#${link.target}`} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h2 className="font-sans text-sm font-semibold text-cream">{ui.findUs}</h2>
          <address className="mt-2 space-y-1 not-italic">
            <p className="flex gap-3 py-2.5">
              <PinIcon className="mt-0.5 size-5 shrink-0 text-cream" />
              <span>
                {farm.address.line1}
                <br />
                {farm.address.line2}
                <br />
                {farm.address.country}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <PhoneIcon className="size-5 shrink-0 text-cream" />
              {farm.phone.includes('PLACEHOLDER') ? (
                <span className="italic">{farm.phone}</span>
              ) : (
                <a href={`tel:${phoneDigits}`} className={linkClass}>
                  {farm.phone}
                </a>
              )}
            </p>
            <p className="flex items-center gap-3">
              <MailIcon className="size-5 shrink-0 text-cream" />
              <a href={`mailto:${farm.email}`} className={`${linkClass} break-all`}>
                {farm.email}
              </a>
            </p>
          </address>
          <p className="mt-5 text-sm">{farm.deliveryNote}.</p>

          <ul className="mt-6 flex gap-3" aria-label={ui.socialMedia}>
            <li>
              <a
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${farm.name}: ${ui.facebook} ${ui.newTab}`}
                className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-milk transition-colors hover:bg-white/20"
              >
                <FacebookIcon />
              </a>
            </li>
            <li>
              <a
                href={links.messenger}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${ui.messageUs}: Messenger ${ui.newTab}`}
                className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-milk transition-colors hover:bg-white/20"
              >
                <MessengerIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm sm:flex-row sm:justify-between">
          <p>
            © {year} {farm.name}, Socorro, Surigao del Norte. Est. {farm.founded}.
          </p>
          <p>{farm.brand}</p>
        </div>
      </div>
    </footer>
  )
}
