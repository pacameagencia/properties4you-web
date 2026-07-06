import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://properties4you.es"),
  title: {
    default: "Properties4You · Costa Blanca",
    template: "%s · Properties4You",
  },
  description:
    "Obra nueva exclusiva en la Costa Blanca. Villas y apartamentos junto al Mediterráneo.",
  openGraph: {
    type: "website",
    siteName: "Properties4You",
    title: "Properties4You · Costa Blanca",
    description:
      "Obra nueva exclusiva en la Costa Blanca. Villas y apartamentos junto al Mediterráneo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="grain min-h-screen">{children}</body>
    </html>
  );
}
