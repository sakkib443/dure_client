import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/redux";
import Preloader from "@/components/shared/Preloader";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

export const metadata: Metadata = {
  title: "Jhamdani — Authentic Bangladeshi Saree & Fashion",
  description: "Shop Bangladesh's finest Jamdani sarees, traditional dresses, mimicry, lehenga and ornaments. Handcrafted by master weavers — delivered to your door.",
  keywords: "jhamdani, jamdani saree, bangladeshi fashion, handloom, mimicry, ornaments, lehenga, salwar kameez",
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23800000'/><text x='50%25' y='58%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white'>জ</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Hind+Siliguri:wght@300;400;500;600;700&family=Tiro+Bangla:ital@0;1&family=Baloo+Da+2:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700;800&family=Galada&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReduxProvider>
          <ThemeProvider>
            <Preloader />
            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
