import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fake Identity Generator',
  description: 'Generate fake identities for testing purposes. Supports 200+ countries.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  )
}
