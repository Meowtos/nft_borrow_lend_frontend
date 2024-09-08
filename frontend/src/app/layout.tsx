import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import "@/assets/css/page.css";
import "@/assets/css/resp.css";

import Header from '@/components/header'
import Footer from "@/components/footer";
import { WalletProvider } from "@/context/WalletProvider";
const font = Josefin_Sans({ subsets: ["latin"], weight: "400" })
export const metadata: Metadata = {
  title: "DeFi NFT Loans",
  description: "Get tokens in loan by lending your nfts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} container-fluid p-0`}>
        <WalletProvider>
          <Header />
          {children}
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
