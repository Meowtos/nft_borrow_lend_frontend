'use client'
import { faq } from "@/utils/constants";
import { useTheme } from '@/context/themecontext';
export function Faqs() {
    const { theme } = useTheme();
    return (
        <section className={`faqs ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`} id="faq">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h2 className="text-center">Frequently Asked Questions</h2>
                        <div className="accordion mt-5 w-75 m-auto rounded" id="faqAccordion">
                            {
                                faq.map((v, idx) => (
                                    <div className="accordion-item mt-3 border-0" key={`faq-${idx}`}>
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