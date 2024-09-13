import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import "@/assets/css/page.css";
import "@/assets/css/resp.css";

import { Toaster } from "sonner";
import { Bootstrap } from "@/context/Bootstrap";
import { WalletProvider } from "@/context/WalletProvider";
import { AppProvider } from "@/context/AppProvider";
import { ProgressBar } from "@/context/ProgressBar";
import Footer from "@/components/footer";
import Header from "@/components/header";

const font = League_Spartan({ subsets: ["latin"], weight: "400" })
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
        <AppProvider>
          <WalletProvider>
            <Header />
            {children}
            <Footer />
          </WalletProvider>
        </AppProvider>
        <Toaster theme="dark" className={font.className} position="bottom-left"/>
        <Bootstrap />
        <ProgressBar />
      </body>
    </html>
  );
}
