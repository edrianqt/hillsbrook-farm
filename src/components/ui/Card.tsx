import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** cream = butter-yellow highlight card, milk = plain card with a soft border */
  tone?: 'cream' | 'milk'
  className?: string
  as?: 'div' | 'article' | 'li'
}

/** A rounded content card for products, pillars and stories. */
export default function Card({ children, tone = 'milk', className = '', as: Tag = 'div' }: Props) {
  const tones = {
    cream: 'bg-cream-50 border-cream',
    milk: 'bg-white border-pasture/10',
  }
  return (
    <Tag className={`relative rounded-3xl border p-6 shadow-[0_1px_2px_rgb(43_36_32/0.06),0_8px_24px_-12px_rgb(12_82_71/0.18)] sm:p-8 ${tones[tone]} ${className}`}>
      {children}
    </Tag>
  )
}
