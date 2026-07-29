import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://dankcheapstores.com"),
  title: {
    default: "DAN K Cheap Stores Ltd — Quality Rice Suppliers & Wholesalers in Kampala, Uganda",
    template: "%s | DAN K Cheap Stores Ltd",
  },
  description:
    "DAN K Cheap Stores Ltd is a trusted rice supplier and wholesaler in Kampala, Uganda. We supply high-quality rice at honest, favourable prices to homes, schools, restaurants, hotels, retailers and wholesalers across Uganda since 2013.",
  keywords: [
    "rice supplier Uganda",
    "rice wholesaler Kampala",
    "buy rice Uganda",
    "bulk rice Kampala",
    "wholesale rice Uganda",
    "DAN K Cheap Stores",
    "rice prices Uganda",
    "quality rice Kampala",
    "rice delivery Uganda",
  ],
  authors: [{ name: "DAN K Cheap Stores Ltd" }],
  creator: "DAN K Cheap Stores Ltd",
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: "https://dankcheapstores.com",
    siteName: "DAN K Cheap Stores Ltd",
    title: "DAN K Cheap Stores Ltd — Quality Rice Suppliers & Wholesalers in Kampala",
    description:
      "High-quality rice at honest, favourable prices. Supplying homes, schools, restaurants, hotels, retailers and wholesalers across Uganda since 2013.",
    images: [{ url: "/emblem.png", width: 512, height: 512, alt: "DAN K Cheap Stores Ltd" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DAN K Cheap Stores Ltd — Quality Rice Suppliers in Kampala, Uganda",
    description: "High-quality rice at honest prices. Supplying across Uganda since 2013.",
    images: ["/emblem.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: "https://dankcheapstores.com" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
