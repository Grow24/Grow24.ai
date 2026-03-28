import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HBMP Modeling Platform',
  description: 'React Flow editor with mxGraph engine for business process modeling',
}

/**
 * Avoid static prerender for routes that rely on Radix/React Flow context during the build.
 * Route segment config must live in a Server Component — do not add `dynamic` inside `'use client'` pages.
 */
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
}