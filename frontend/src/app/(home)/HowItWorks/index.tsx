'use client'
import { working } from "@/utils/constants";
import { useTheme } from '@/context/themecontext';
export function HowItWorks() {
    const { theme } = useTheme();
    return (
        <>
            <section className={`about ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 p-0">
                            <h2 className="text-center">How It Works</h2>
                            <div className="work-row rounded">
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
        </>
    )
}