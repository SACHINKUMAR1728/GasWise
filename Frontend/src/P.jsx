
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";
import "./styles.css"
import { useNavigate } from "react-router-dom";


const P = (props) => {
  const navigate = useNavigate();

    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };


    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: "#000000",
                },
            },
            fpsLimit: 150,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "repulse",
                    },
                    onHover: {
                        enable: true,
                        mode: 'grab',
                    },
                },
                modes: {
                    push: {
                        distance: 200,
                        duration: 15,
                    },
                    grab: {
                        distance: 250,
                    },
                },
            },
            particles: {
                color: {
                    value: "#000000",
                },
                links: {
                    color: "#FFFFFF",
                    distance: 150,
                    enable: true,
                    opacity: 0.7,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: true,
                    speed: 3,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 150,
                },
                opacity: {
                    value: 1.0,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 3 },
                },
            },
            detectRetina: true,
        }),
        [],
    );


    return (<div style={{ position: "relative" }}>
        <Particles id={props.id} init={particlesLoaded} options={options} />
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "#ffffff",
                zIndex: 1000, 
            }}
        >
            <div className="relative top-[300px] w-[700px]">
                <h1 className="text-5xl font-bold text-white mb-8 shadow animate-fadeInUp" id="main">
                    GasWise
                </h1>
                <p className="text-3xl text-white max-w-xl mb-12 shadow-md mx-auto font-thin">
                Crafting Smarter Contracts, Cutting Gas Costs
                </p>
                <button className="bg-white text-black p-3 rounded-[10px] px-6 text-[18px]" onClick={()=>{
                    navigate("/body")
                }}>Get Started</button>

            </div>
        </div>
    </div>);
};

export default P;