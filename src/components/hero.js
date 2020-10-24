import React from "react";

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
    <div className="z-10 flex flex-col">
      {/* title */}
      <div
        className="font-black text-indigo-500"
        style={{ "font-size": "6rem" }}
      >
        juniper
      </div>
      {/* subtitle */}
      <code className="text-right font-mono font-bold text-indigo-600">
        software.engineer();
      </code>
    </div>
  </section>
);
