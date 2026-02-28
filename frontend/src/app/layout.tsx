import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import ModalManager from "@/components/ModalManager";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CollegeDost",
  description: "Find your dream college",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch tracking codes from public site settings endpoint
  let trackingCodes = { googleTrackingCode: '', metaTrackingCode: '' };
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (apiBaseUrl) {
      const response = await fetch(`${apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`}/site/settings`, { cache: 'no-store' });
      const data = await response.json();
      if (data.success && data.data) {
        trackingCodes = data.data;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch tracking codes for RootLayout');
  }

  return (
    <html lang="en">
      <head>
        {/* Inject Google Tracking Code */}
        {trackingCodes.googleTrackingCode && (
          <div dangerouslySetInnerHTML={{ __html: trackingCodes.googleTrackingCode }} />
        )}
        {/* Inject Meta Tracking Code (Head Part) */}
        {trackingCodes.metaTrackingCode && (
          <div dangerouslySetInnerHTML={{ __html: trackingCodes.metaTrackingCode }} />
        )}
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-background-light`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ModalManager />
        </Providers>
      </body>
    </html>
  );
}
