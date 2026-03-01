import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'GitGenie - GitHub Achievement Alchemist',
  description: 'Unlock all GitHub achievements with our interactive, jaw-dropping platform',
  keywords: ['GitHub', 'achievements', 'gamification', 'developer'],
  authors: [{ name: 'Jesun Ahmad Ushno' }],
  creator: 'Jesun Ahmad Ushno',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gitgenie.dev',
    title: 'GitGenie - GitHub Achievement Alchemist',
    description: 'Unlock all GitHub achievements with our interactive platform',
    siteName: 'GitGenie',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitGenie',
    description: 'Unlock all GitHub achievements',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F172A" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
