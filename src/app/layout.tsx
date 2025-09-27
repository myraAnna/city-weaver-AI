import type { Metadata } from "next"
import Script from "next/script"
import { PageTransition } from "@/components/layout"
import { ClientProviders } from "@/components/providers/client-providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "City Weaver AI",
  description: "An AI-powered city planning application",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.1/dist/dotlottie-wc.js"
          strategy="beforeInteractive"
        />
        <ClientProviders>
          <PageTransition className="min-h-screen">
            {children}
          </PageTransition>
        </ClientProviders>
      </body>
    </html>
  )
}