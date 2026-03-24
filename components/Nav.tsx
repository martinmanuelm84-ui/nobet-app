'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lang, t } from '@/lib/i18n'

export default function Nav({ lang, onLangChange }: { lang: Lang; onLangChange: (l: Lang) => void }) {
  const path = usePathname()

  const items = [
    { href: '/home', label: lang === 'ro' ? 'Acasă' : 'Home' },
    { href: '/companion', label: lang === 'ro' ? 'Suport' : 'Support' },
    { href: '/jocuri', label: lang === 'ro' ? 'Jocuri' : 'Games' },
    { href: '/journal', label: lang === 'ro' ? 'Jurnal' : 'Journal' },
    { href: '/progress', label: lang === 'ro' ? 'Progres' : 'Progress' },
    { href: '/contor', label: lang === 'ro' ? 'Contor' : 'Counter' },
    { href: '/muzica', label: lang === 'ro' ? '♪ Muzică' : '♪ Music' },
  ]

  return (
    <nav className="top-nav">
      <Link href="/home" className="nav-brand">BetOff</Link>
      <div className="nav-links">
        {items.map(item => (
          <Link key={item.href} href={item.href}
            className={`nav-item ${path === item.href || (item.href === '/jocuri' && path.startsWith('/jocuri')) ? 'active' : ''}`}>
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
