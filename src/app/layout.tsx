"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useStore } from "./lib/store";
import { useEffect } from "react";
import Head from "next/head";
import { metadata } from "./lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hydrate = useStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta
          name={metadata.title}
          content={metadata.description}
        />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
