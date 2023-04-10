import React, { Component } from 'react';
import Particles from 'react-tsparticles';
import type { Container, ISourceOptions, Engine } from "tsparticles-engine";

const Particle = () => {

    const particlesInit = async (engine: Engine) => {
        /*console.log(main);*/
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    }

    const particlesLoaded = async (container?: Container) => {
        /*console.log(container);*/
    }

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                    color: {
                        value: 'none'
                    }
                },
                fpsLimit: 70,
                interactivity: {
                    detectsOn: 'canvas',
                    events: {
                        onClick: {
                            enable: true,
                            mode: 'push'
                        },
                        onHover: {
                            enable: true,
                            mode: 'repulse'
                        },
                        resize: true
                    },
                    modes: {
                        bubble: {
                            distance: 400,
                            duration: 2,
                            opacity: 0.8,
                            size: 40
                        },
                        push: {
                            quantity: 1
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        }
                    }
                },
                particles: {
                    color: {
                        value: '#ffffff'
                    },
                    links: {
                        color: '#ffffff',
                        distance: 150,
                        enable: false,
                        opacity: 0.5,
                        width: 1
                    },
                    collisions: {
                        enable: true
                    },
                    move: {
                        direction: 'none',
                        enable: true,
                        outMode: 'bounce',
                        random: false,
                        speed: 2,
                        straight: false
                    },
                    number: {
                        density: {
                            enable: true,
                            value_area: 400
                        },
                        value: 20
                    },
                    opacity: {
                        value: 0.5
                    },
                    shape: {
                        type: 'circle'
                    },
                    size: {
                        random: true,
                        value: 5
                    }
                },
                detectRetina: true
            }}
        />
    )
}

export default Particle;
