import type { ReactNode } from 'react'
import { ui } from '../../content/site'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light'
type Size = 'md' | 'lg'

type Props = {
  children: ReactNode
  variant?: Variant
  size?: Size
  /** If given, the button is a link. Links to other websites open in a new tab. */
  href?: string
  onClick?: () => void
  className?: string
  icon?: ReactNode
  /** Greyed out and not clickable (links become plain buttons) */
  disabled?: boolean
}

const variants: Record<Variant, string> = {
  // Barn red: the main "do this" action
  primary: 'bg-barn text-white shadow-sm hover:bg-barn-dark',
  // Green outline: a second, quieter action
  secondary: 'border-2 border-pasture text-pasture hover:bg-pasture hover:text-milk',
  // Text-only action
  ghost: 'text-pasture underline-offset-4 hover:underline',
  // For dark backgrounds
  light: 'bg-milk text-pasture hover:bg-cream',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-13 px-7 text-base',
}

/** The site's one button style, in four variants. Always at least 44px tall for easy tapping. */
export default function Button({ children, variant = 'primary', size = 'md', href, onClick, className = '', icon, disabled = false }: Props) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${className}`

  if (href && !disabled) {
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {icon}
        {children}
        {external && <span className="sr-only"> {ui.newTab}</span>}
      </a>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick} disabled={disabled}>
      {icon}
      {children}
    </button>
  )
}
