import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LORRAINE | Haarstudio — Landau in der Pfalz',
  description: 'Haarstudio in Landau in der Pfalz. Von Frauen geführt. Theaterstraße 16.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
