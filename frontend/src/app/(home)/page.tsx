import React from "react";
import Link from "next/link";
import { ParticlesComponent } from "./ReactParticles";
import { NftSlider } from "./NftSlider";
import { faq, working } from "@/utils/constants";
export default function Home() {
  return (
    <React.Fragment>
      <ParticlesComponent id="particles-bg" />
      <Banner />
      <About />
      <NftSlider />
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
          <div className="col-12 col-lg-8">
            <h1>Unlock NFT Value with Instant Crypto Loans</h1>
            <p className="pt-3">Turn your NFTs into collateral and access cryptocurrency loans with ease. No need to sell—just lend your NFTs and get the liquidity you need in minutes.</p>
            <Link href={"/borrow/assets"}>
              <button className="connect-btn mt-4">Get a loan now</button>
            </Link>
            <Link href={"/lend/assets"}>
              <button className="connect-btn mt-4 ms-3">I want to lend</button>
            </Link>
          </div>
          <div className="col-12 col-lg-4">
            <div className="scene">
              <div className="cube">
                {
                  faces.map((face, idx)=>(
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
            <div className="steps pt-4">
              {
                working.map((v, idx) => (
                  <div className={`step${idx + 1} ${idx % 2 === 0 ? "ps-right" : "ps-left"}`} key={`idx-${idx}`}>
                    <h3>{v.heading}</h3>
                    <p className={`${idx % 2 !== 0 ? "text-end ms-auto" : ""}`}>{v.description}</p>
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