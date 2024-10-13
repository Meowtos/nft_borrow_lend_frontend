import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";

import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import "@/assets/css/page.css";
import "@/assets/css/resp.css";
import "@/assets/css/animate.css";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import { Bootstrap } from "@/context/Bootstrap";
import { WalletProvider } from "@/context/WalletProvider";
import { AppProvider } from "@/context/AppProvider";
import { ProgressBar } from "@/context/ProgressBar";
import Footer from "@/components/footer";
const Header = dynamic(()=>import("@/components/header"), { ssr: false })

import { ThemeProvider } from '@/context/themecontext';
import { project } from "@/utils/constants";

const font = League_Spartan({ subsets: ["latin"], weight: "400" })
export const metadata: Metadata = {
  title: project,
  description: `${project} - Instant NFT Loans on your favorite Aptos blockchain`,
  openGraph: {
    title: project,
    description: `${project} - Instant NFT Loans on your favorite Aptos blockchain`,
    images: ["/media/octos-dark.png"],
  },
  twitter: {
    card: "summary",
    site: "",
    title: project,
    description: `${project} - Instant NFT Loans on your favorite Aptos blockchain`,
    images: ["/media/octos-dark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
    <html lang="en">
      <body className={`${font.className} container-fluid p-0`}>
        <AppProvider>
          <WalletProvider>
            <Header />
            {children}
            <Footer />
          </WalletProvider>
        </AppProvider>
        <Toaster theme="dark" className={font.className} position="bottom-left" duration={5000}/>
        <Bootstrap />
        <ProgressBar />
      </body>
    </html>
    </ThemeProvider>
  );
}
