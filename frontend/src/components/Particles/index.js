"use client"
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect } from "react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from '@/context/themecontext'; 

export const InnerParticlesComponent = (props) => {
    const { theme } = useTheme();
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        })
    }, []);
    const particlesOptions = {
        particles: {
            number: {
                value: 25,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: theme === 'dark' ? '#8E05C2' : '#D9A6FF', 
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 1,
                    color: "#a16eee"
                },
                polygon: {
                    nb_sides: 7
                },
                image: {
                    src: "img/github.svg",
                    width: 100,
                    height: 100
                }
            },
            opacity: {
                value: 1,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3.945738208161363,
                random: false,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#a16eee",
                opacity: 0.8,
                width: 2
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: false,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    }
    return <Particles id={props.id} options={particlesOptions} />;
};
