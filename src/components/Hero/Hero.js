import React from "react";

import { JuniperSVG } from "./JuniperSVG.js";
import "./Hero.css";

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
      <JuniperSVG className="hero-fade-in" />
      {/* subtitle */}
      <code className="text-right font-mono font-bold text-indigo-500 hero-fade-in hero-fade-in--subtitle">
        software.engineer();
      </code>
    </div>
  </section>
);
