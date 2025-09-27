import type { Metadata } from "next"
import { PageTransition } from "@/components/layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "City Weaver AI",
  description: "An AI-powered city planning application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.1/dist/dotlottie-wc.js" type="module"></script>
      </head>
      <body className="antialiased">
        <PageTransition className="min-h-screen">
          {children}
        </PageTransition>
      </body>
    </html>
  )
}