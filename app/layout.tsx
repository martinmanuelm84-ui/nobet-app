import type { Metadata } from 'next'
import './globals.css'
import CrisisWrapper from '@/components/CrisisWrapper'

export const metadata: Metadata = {
  title: 'BetOff — Fiecare zi contează',
  description: 'Companion pentru recuperare din dependența de jocuri de noroc.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>
        {children}
        <CrisisWrapper />
      </body>
    </html>
  )
}
