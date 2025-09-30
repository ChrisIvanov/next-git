import type { Metadata } from "next";
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Navigation from "@/components/Navigation"
import "./globals.css";
//import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: 'NextGit - VCS Project',
  description: 'Учебен проект по Next.js със Supabase - GitHub like Version Control System(VCS) ',
  keywords: ["Next.js", "Supabase", "GitHub clone", "VCS", "course project"],
  openGraph: {
    title: "NextGit - Version Control System",
    description: "Учебен проект с Next.js и Supabase – система за контрол на версиите като GitHub.",
    url: "https://your-vercel-app.vercel.app",
    siteName: "NextGit",
    images: [
      {
        url: "https://your-vercel-app.vercel.app/og-image.png", // ще направим по-долу
        width: 1200,
        height: 630,
        alt: "NextGit Project Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@your_twitter",
    creator: "@your_twitter",
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}

