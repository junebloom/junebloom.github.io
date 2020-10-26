import React from "react";

import { Juniper } from "./juniper.svg.js";
import "./hero.css";

export const Hero = () => (
  <section className="overflow-visible w-full h-screen relative flex justify-center items-center">
    {/* background shapes */}
    <div
      className="absolute bg-red-400"
      style={{
        width: "80vw",
        height: "60vw",
        transform: "translate(-35%, -32%) rotate(-30deg)",
      }}
    />
    <div
      className="absolute bg-indigo-500"
      style={{
        width: "80vw",
        height: "60vw",
        transform: "translate(-50%, -90%) rotate(-30deg)",
      }}
    />
    {/* name container */}
    <div className="relative flex flex-col space-y-2 mt-24">
      {/* title */}
      <Juniper className="hero-fade-in" />
      {/* subtitle */}
      <code className="text-right font-mono font-bold text-indigo-600 hero-fade-in-subtitle">
        software.engineer();
      </code>
    </div>
  </section>
);
