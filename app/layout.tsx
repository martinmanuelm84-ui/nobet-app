import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NoBet — Fiecare zi contează',
  description: 'Companion pentru recuperare din dependența de jocuri de noroc.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  )
}
