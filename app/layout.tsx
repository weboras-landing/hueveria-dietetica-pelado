import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/components/cart-provider'
import { Toaster } from 'sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Huevería y Dietética El Pelado | Catálogo Virtual',
    template: '%s | El Pelado'
  },
  description: 'Comprá online huevos frescos, frutos secos, semillas y legumbres de la mejor calidad. Venta por mayor y menor. Envíos a domicilio en Cosquín y zona.',
  keywords: ['huevería', 'dietética', 'frutos secos', 'huevos frescos', 'semillas', 'legumbres', 'Cosquín', 'El Pelado', 'venta por mayor', 'venta por menor'],
  authors: [{ name: 'El Pelado' }],
  creator: 'El Pelado',
  publisher: 'El Pelado',
  metadataBase: new URL('https://elpelado.com.ar'),
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://elpelado.com.ar',
    title: 'Huevería y Dietética El Pelado | Catálogo Virtual',
    description: 'Comprá online huevos frescos, frutos secos, semillas y legumbres de la mejor calidad. Venta por mayor y menor.',
    siteName: 'El Pelado',
    images: [
      {
        url: '/images/logo-mascot.png',
        width: 1200,
        height: 630,
        alt: 'El Pelado - Huevería y Dietética',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huevería y Dietética El Pelado',
    description: 'Comprá online huevos frescos, frutos secos, semillas y legumbres de la mejor calidad.',
    images: ['/images/logo-mascot.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster position="bottom-right" richColors closeButton />
        <Analytics />
      </body>
    </html>
  )
}
