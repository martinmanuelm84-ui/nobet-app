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
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: '45vw', height: '45vw', maxWidth: 600, maxHeight: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,106,79,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute', top: '30%', right: '-8%',
            width: '40vw', height: '40vw', maxWidth: 500, maxHeight: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.09) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '5%', left: '20%',
            width: '35vw', height: '35vw', maxWidth: 450, maxHeight: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,106,79,0.08) 0%, transparent 70%)',
            filter: 'blur(45px)',
          }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
        <CrisisWrapper />
      </body>
    </html>
  )
}
