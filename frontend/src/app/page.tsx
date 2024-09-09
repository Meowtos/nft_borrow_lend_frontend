"use client"
import React from "react";
import "swiper/css";
import 'swiper/css/effect-cards';
import ParticlesComponent from '@/components/config/particles'
import Link from "next/link";
import Image from "next/image"

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const swiperConfig = {
  slidesPerView: 1,
  spaceBetween: 20,
  pagination: {
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  },
  modules: [Pagination],
  className: 'mySwiper',
};

export default function Home() {
  const repeater = 5;
  return (
    <>

      <ParticlesComponent id="particles-bg" />
      {/* banner */}
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
                <button className="connect-btn mt-4 ms-3">I want to lend</button>
              </Link>
            </div>
            <div className="col-12 col-lg-4">
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

      {/* how it works */}
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
                  <p className="text-end ms-auto">Repay the loan amount plus interest at any time. Once the loan is repaid, your NFT is immediately released from escrow and returned to your wallet.</p>
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

      {/* Collection Slider */}
      <section className="coll-slider">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="text-center mb-5">Popular Collections</h2>
              <Swiper {...swiperConfig}>
                {Array.from({ length: repeater }).map((_, index) => (
                  <SwiperSlide>
                    <div className="nft-coll rounded">
                      <div className="coll-thumbnail">
                        <Image src={`/media/nfts/${index + 1}.jpeg`} alt="nft" height={350} width={400} className="w-100" />
                      </div>
                      <div className="coll-details">
                        <h5 className="text-center coll-title">legends trade</h5>
                        <div className="row pt-3">
                          <div className="col text-center p-0">
                            <h6>Loan Count</h6>
                            <p>200</p>
                          </div>
                          <div className="col text-center p-0">
                            <h6>APR</h6>
                            <p>30%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section >

      {/* Faqs */}
      < section className="faqs" >
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="text-center">Frequently Asked Questions</h2>
              <div className="accordion mt-4 w-75 m-auto">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      What is NFT lending?
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      NFT lending allows users to use their NFTs (non-fungible tokens) as collateral to borrow cryptocurrency. By locking their NFTs into a lending platform, users can access liquidity without selling their digital assets.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      How does the NFT lending process work?
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      Borrowers pledge their NFTs as collateral on the platform. Lenders offer cryptocurrency loans based on the value of the NFT. If the borrower repays the loan with interest, they get their NFT back. If not, the lender can claim the NFT.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      What types of NFTs can be used as collateral?
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      The types of NFTs eligible for lending depend on the platform. Commonly accepted NFTs include high-value digital art, game items, virtual land, and collectibles from popular projects like Bored Ape Yacht Club or CryptoPunks.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      How is the value of my NFT determined?
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      The value of an NFT is usually determined by its current market price, historical sales, rarity, and demand. Some platforms may use oracle services or third-party evaluators to estimate the value of the NFT.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      What happens if I can't repay the loan?
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      If the loan is not repaid within the agreed-upon time frame, the lender typically gains full ownership of the NFT. This is similar to how traditional loans work with collateral.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* <section className="card"> */}
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
      {/* </section> */}
    </>
  );
}
