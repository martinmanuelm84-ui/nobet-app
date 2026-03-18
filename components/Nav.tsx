'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lang, t } from '@/lib/i18n'

export default function Nav({ lang, onLangChange }: { lang: Lang; onLangChange: (l: Lang) => void }) {
  const path = usePathname()
  const tr = t[lang].nav

  const items = [
    { href: '/home', icon: '🏠', label: tr.home },
    { href: '/companion', icon: '💬', label: tr.companion },
    { href: '/journal', icon: '📓', label: tr.journal },
    { href: '/guide', icon: '📖', label: tr.guide },
    { href: '/progress', icon: '📈', label: tr.progress },
  ]

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-item ${path === item.href ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
