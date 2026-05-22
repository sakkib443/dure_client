import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/redux";
import Preloader from "@/components/shared/Preloader";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

export const metadata: Metadata = {
  title: "Chutli - Your Premium E-commerce Destination",
  description: "Exquisite handloom and designer collections. Shop contemporary and traditional wear at Chutli.",
  keywords: "chutli, jhamdani, ecommerce, handloom, fashion, clothing, bangladesh",
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
        <link rel="icon" href="/images/chutli.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.maateen.me/charukola-ultra-light/font.css" rel="stylesheet" />
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
