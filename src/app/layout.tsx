import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "DAN K CHEAP STORES",
  description: "Premium Rice & Wholesale Grains — Kampala, Uganda",
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
