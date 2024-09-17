'use client'
import Image from 'next/image'
import { chooseUs } from '@/utils/constants'
export function WhyChooseUs() {
    return (
        <>
            <section className="why-choose-us py-100">
                <div className="container">
                    <h2 className="text-center">Why Choose Us?</h2>
                    <div className="row wcs-cards">
                        {
                            chooseUs.map((v, index) => {
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