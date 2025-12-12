import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "bengali"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "গ্লোবাল এরিনা - সঞ্চয় প্ল্যাটফর্ম",
  description: "কর্মজীবী মানুষের জন্য একটি সঞ্চয় প্ল্যাটফর্ম",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={hindSiliguri.variable} suppressHydrationWarning>
      <body className={`antialiased font-sans ${hindSiliguri.className}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

