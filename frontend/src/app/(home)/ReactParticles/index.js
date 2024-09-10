"use client"
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo } from "react";
import { config as ParticlesConfig } from "./config"; 
import { loadSlim } from "@tsparticles/slim";

export const ParticlesComponent = (props) => {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    })
  }, []);
  const options = useMemo(
    () => (ParticlesConfig),
    [],
  );
  return <Particles id={props.id} options={options} />; 
};
