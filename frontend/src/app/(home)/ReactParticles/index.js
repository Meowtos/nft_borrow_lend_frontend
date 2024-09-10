"use client"
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { config as ParticlesConfig } from "./config"; 
import { loadSlim } from "@tsparticles/slim";

export const ParticlesComponent = (props) => {
  const [_init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  const particlesLoaded = (_container) => {
  };
  const options = useMemo(
    () => (ParticlesConfig),
    [],
  );
  return <Particles id={props.id} init={particlesLoaded} options={options} />; 
};
