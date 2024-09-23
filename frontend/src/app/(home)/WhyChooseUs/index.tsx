'use client'
import Image from 'next/image'
import { chooseUs } from '@/utils/constants'
import { useTheme } from '@/context/themecontext'
import { useEffect } from 'react';
export function WhyChooseUs() {
    const { theme } = useTheme();
    useEffect(() => {
        if (typeof document !== undefined) {
            const cards = document.querySelectorAll('.card-outline');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function () {
                    card.classList.add('active');
                });

                card.addEventListener('mouseleave', function () {
                    card.classList.remove('active');
                });
            });
        }
    }, [])

    return (
        <>
            <section className={`why-choose-us py-100 ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
                <div className="container">
                    <h2 className="text-center">Why Choose Us?</h2>
                    <div className="row wcs-cards">
                        {
                            chooseUs.map((v, index) => {
                                return (
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
                                                    <Image src={v.imgurl} alt="vec-image" className='vec-def' height={100} width={90} />
                                                    <Image src={v.imgurl_active} alt="vec-image" className='vec-active' height={100} width={90} />
                                                </div>
                                            </div>
                                            <p className="pt-4">{v.description}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
        </>
    )
}