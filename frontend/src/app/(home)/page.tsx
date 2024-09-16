import React from "react";
import Link from "next/link";
import { ParticlesComponent } from "./ReactParticles";
// import { NftSlider } from "./NftSlider";
import { faq, working } from "@/utils/constants";
import Image from 'next/image'

export const metadata = {
  title: "Home - DeFi NFT Loans",
  description: "Homepage of DeFi NFT Loans"
}
export default function Home() {
  return (
    <React.Fragment>
      <ParticlesComponent id="particles-bg" />
      <Banner />
      <About />
      {/* <NftSlider /> */}
      <WhyChooseUs />
      <Faq />
    </React.Fragment>
  );
}

function Banner() {
  const faces = ["front", "back", "right", "left", "top", "bottom"];
  return (
    <section className="banner">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-8 banner-content">
            <h1>Unlock NFT Value with Instant Crypto Loans</h1>
            <p className="pt-3">Turn your NFTs into collateral and access cryptocurrency loans with ease. No need to sell—just lend your NFTs and get the liquidity you need in minutes.</p>
            <Link href={"/borrow/assets"}>
              <button className="banner-btn mt-4">Get a loan now</button>
            </Link>
            <Link href={"/lend/assets"}>
              <button className="banner-btn mt-4 ms-4">I want to lend</button>
            </Link>
          </div>
          <div className="col-12 col-lg-4">
            <div className="scene">
              <div className="cube">
                {
                  faces.map((face, idx) => (
                    <div className={`face ${face}`} key={`face-${idx}`}></div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">How it Works</h2>
            {/* <div className="steps pt-4">
              {
                working.map((v, idx) => (
                  <div className={`step${idx + 1} ${idx % 2 === 0 ? "ps-right" : "ps-left"}`} key={`idx-${idx}`}>
                    <h3>{v.heading}</h3>
                    <p className={`${idx % 2 !== 0 ? "text-end ms-auto" : ""}`}>{v.description}</p>
                  </div>
                ))
              }
            </div> */}

            <div className="work-row">
              {
                working.map((v, idx) => (

                  <div className="outer" key={`idx-${idx}`}>
                    <div className="main">
                      <h4>{v.heading}</h4>
                      <p className="pt-3">{v.description}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyChooseUs() {
  const cardContent = [
    {
      sr_no: '01',
      title: 'Secure NFT Lending',
      imgurl: '/media/nfts/2.jpeg',
      imgurl_active: '/media/nfts/3.jpeg',
      description: 'We ensure top-notch security for both NFT owners and lenders, leveraging the Aptos blockchain to safeguard all transactions.',
    },
    {
      sr_no: '02',
      title: 'Fast & Low-Cost Deals',
      imgurl: '/media/nfts/4.jpeg',
      imgurl_active: '/media/nfts/5.jpeg',
      description: 'Enjoy minimal gas fees and rapid transactions on Aptos, delivering a smooth and cost-effective lending experience.',
    },
    {
      sr_no: '03',
      title: 'Verified Smart Contracts',
      imgurl: '/media/nfts/4.jpeg',
      imgurl_active: '/media/nfts/5.jpeg',
      description: 'Our platform uses transparent smart contracts that ensure fairness, trust, and complete verification in every lending process.',
    },
    {
      sr_no: '04',
      title: 'Community-Driven',
      imgurl: '/media/nfts/4.jpeg',
      imgurl_active: '/media/nfts/5.jpeg',
      description: 'We engage actively with our community to drive innovation, ensuring the platform evolves to meet users’ growing needs.',
    },
    {
      sr_no: '05',
      title: 'Flexible Loan Options',
      imgurl: '/media/nfts/4.jpeg',
      imgurl_active: '/media/nfts/5.jpeg',
      // description: 'Flexible lending terms let users customize loan agreements, maximizing the value of their digital assets.',
      description: 'Flexible lending terms empower users to customize loan agreements, maximizing the potential value of their digital assets.',
    },
    {
      sr_no: '06',
      title: 'Trustless & Decentralized',
      imgurl: '/media/nfts/4.jpeg',
      imgurl_active: '/media/nfts/5.jpeg',
      description: 'Our decentralized lending platform eliminates intermediaries, guaranteeing full control of your assets throughout the process.',
    }
  ]
  return (
    <>
      <section className="why-choose-us py-100">
        <div className="container">
          {/* <h6 className="sub-heading text-center">Why Choose Us</h6>
          <h2 className="text-center">Reason For Choosing Us</h2> */}
          <h2 className="text-center">Why Choose Us?</h2>
          <div className="row wcs-cards">
            {
              cardContent.map((v, index) => {
                return (
                  <>
                    <div className="card-outline p-0" key={index}>
                      <div className="col wcs-card">
                        <div className="row m-0">
                          <div className="col-8 p-0">
                            <div className="sr-no">
                              <h3 >{v.sr_no}</h3>
                            </div>
                            <h4 className="pt-4">{v.title}</h4>
                          </div>
                          <div className="col-4 text-end p-0">
                            <Image src={v.imgurl} alt="vec-image" height={100} width={100} />
                            {/* <Image src={v.imgurl_active} alt="vec-image" height={100} width={100} /> */}
                          </div>
                        </div>
                        <p className="pt-4">{v.description}</p>
                      </div>
                    </div>
                  </>
                )
              })
            }
          </div>
        </div>
      </section>
    </>
  )
}

function Faq() {
  return (
    <section className="faqs" id="faq">
      <div className="container">
        <div className="row">
          <div className="col">
            <h2 className="text-center">Frequently Asked Questions</h2>
            <div className="accordion mt-5 w-75 m-auto" id="faqAccordion">
              {
                faq.map((v, idx) => (
                  <div className="accordion-item" key={`faq-${idx}`}>
                    <h2 className="accordion-header" id={`heading-${idx}`}>
                      <button className={`accordion-button collapsed`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${idx}`} aria-expanded="true" aria-controls={`collapse-${idx}`}>
                        {v.ques}
                      </button>
                    </h2>
                    <div id={`collapse-${idx}`} className={`accordion-collapse collapse`} aria-labelledby={`heading-${idx}`} data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        {v.ans}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}