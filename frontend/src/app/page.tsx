"use client"
import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/effect-cards';
// import { EffectCards, Autoplay } from 'swiper/modules';
// import Image from 'next/image'
import ParticlesComponent from '@/components/config/particles'
import Link from "next/link";
export default function Home() {
  return (
    <>
      
      <ParticlesComponent id="particles-bg" />
      <section className="banner">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <h1>Unlock NFT Value with Instant Crypto Loans</h1>
              <p className="pt-3">Turn your NFTs into collateral and access cryptocurrency loans with ease. No need to sell—just lend your NFTs and get the liquidity you need in minutes.</p>
              <Link href={"/borrow"}>
                <button className="connect-btn mt-4">Get a loan now</button>
              </Link>
              <Link href={"/lend"}>
                <button className="connect-btn mt-4">I want to lend</button>
              </Link>
            </div>
            <div className="col-12 col-lg-4">
              {/* <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards, Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="mySwiper banner-cards" >
                <SwiperSlide><Image src="/media/nfts/1.jpeg" alt="nft" height={600} width={500} className="w-100" /></SwiperSlide>
                <SwiperSlide><Image src="/media/nfts/2.jpeg" alt="nft" height={600} width={500} className="w-100" /></SwiperSlide>
                <SwiperSlide><Image src="/media/nfts/3.jpeg" alt="nft" height={600} width={500} className="w-100" /></SwiperSlide>
                <SwiperSlide><Image src="/media/nfts/4.jpeg" alt="nft" height={600} width={500} className="w-100" /></SwiperSlide>
                <SwiperSlide><Image src="/media/nfts/5.jpeg" alt="nft" height={600} width={500} className="w-100" /></SwiperSlide>
                <SwiperSlide><Image src="/media/nfts/6.jpeg" alt="nft" height={600} width={500} className="w-100" /></SwiperSlide>
                <SwiperSlide><Image src="/media/nfts/7.jpeg" alt="nft" height={600} width={500} className="w-100" /></SwiperSlide>
                <SwiperSlide><Image src="/media/nfts/8.jpeg" alt="nft" height={600} width={500} className="w-100" /></SwiperSlide>
                <SwiperSlide><Image src="/media/nfts/9.jpeg" alt="nft" height={600} width={500} className="w-100" /></SwiperSlide>
              </Swiper> */}
              <div className="scene">
                <div className="cube">
                  <div className="face front"></div>
                  <div className="face back"></div>
                  <div className="face right"></div>
                  <div className="face left"></div>
                  <div className="face top"></div>
                  <div className="face bottom"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center">How it Works</h2>
              <div className="steps pt-4">
                <div className="step1 ps-right">
                  <h3>Select Your NFT</h3>
                  <p>Begin by connecting your wallet and selecting the NFT you&apos;d like to use as collateral. Whether it&apos;s a valuable piece of digital art or a sought-after collectible, your NFT holds the key to unlocking crypto liquidity.</p>
                </div>
                <div className="step2 ps-left">
                  <h3>Get Instant Valuation</h3>
                  <p className="text-end ms-auto">Our platform instantly evaluates the market value of your NFT based on recent sales and market trends. This ensures you receive a fair and transparent loan offer in exchange for your asset.</p>
                </div>
                <div className="step3 ps-right">
                <h3>Receive Crypto Loan</h3>
                <p>Once you accept the loan terms, your NFT is held securely in escrow, and the cryptocurrency loan is transferred directly to your wallet. You can now use the crypto for any purpose while your NFT is safely stored.</p>
                </div>
                <div className="step4 ps-left">
                <h3>Repay the Loan</h3>
                <p  className="text-end ms-auto">Repay the loan amount plus interest at any time. Once the loan is repaid, your NFT is immediately released from escrow and returned to your wallet.</p>
                </div>
                <div className="step5 ps-right">
                <h3>Default Option</h3>
                <p>If you choose not to repay the loan, the NFT is transferred to the lender. There&apos;s no risk of additional fees or credit score impact—only the ownership of the NFT is transferred.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card">

      </section>
    </>
  );
}
