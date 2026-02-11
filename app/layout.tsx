import type { Metadata, Viewport } from "next";
import { Anek_Bangla } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Toaster from "@/components/common/Toaster";
import { PWAInstallBanner } from "@/components/pwa-install-banner";
import "./globals.css";

const anekBangla = Anek_Bangla({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "bengali"],
  variable: "--font-anek-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "রিটার্ন ভ্যাটেড - সঞ্চয় প্ল্যাটফর্ম",
  description: "কর্মজীবী মানুষের জন্য একটি সঞ্চয় প্ল্যাটফর্ম",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ReturnVetted",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={anekBangla.variable} suppressHydrationWarning>
      <body className={`antialiased font-sans ${anekBangla.className}`} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster />
          <PWAInstallBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
