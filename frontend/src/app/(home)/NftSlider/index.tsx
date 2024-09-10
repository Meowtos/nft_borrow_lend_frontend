"use client"
import "swiper/css";
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { config as swiperConfig } from "./config"
import Image from "next/image";
const repeater = 10;
export function NftSlider() {
    return (
        <section className="coll-slider">
            <div className="container-fluid">
                <div className="row">
                    <div className="col px-3">
                        <h2 className="text-center mb-5">Popular Collections</h2>
                        <Swiper {...swiperConfig}>
                            {Array.from({ length: repeater }).map((_, index) => (
                                <SwiperSlide>
                                    <div className="nft-coll rounded">
                                        <div className="coll-thumbnail">
                                            <Image src={`/media/nfts/${index + 1}.jpeg`} alt="nft" height={320} width={400} className="w-100" />
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
    )
}