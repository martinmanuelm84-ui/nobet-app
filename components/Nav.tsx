'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lang, t } from '@/lib/i18n'

export default function Nav({ lang, onLangChange }: { lang: Lang; onLangChange: (l: Lang) => void }) {
  const path = usePathname()
  const tr = t[lang].nav

  const items = [
    { href: '/home', label: tr.home },
    { href: '/companion', label: tr.companion },
    { href: '/guide', label: tr.guide },
    { href: '/journal', label: tr.journal },
    { href: '/progress', label: tr.progress },
    { href: '/contor', label: lang === 'ro' ? 'Contor' : 'Counter' },
  ]

  return (
    <nav className="top-nav">
      <Link href="/home" className="nav-brand">NoBet</Link>
      <div className="nav-links">
        {items.map(item => (
          <Link key={item.href} href={item.href}
            className={`nav-item ${path === item.href ? 'active' : ''}`}>
            {item.label}
          </Link>
        ))}
        <div className="lang-switch">
          <button className={`lang-btn ${lang === 'ro' ? 'active' : ''}`} onClick={() => onLangChange('ro')}>RO</button>
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => onLangChange('en')}>EN</button>
        </div>
      </div>
    </nav>
  )
}
