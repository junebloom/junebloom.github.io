import React from "react";

export const Tile = ({ title, subtitle, className = "text-indigo-500" }) => (
  <li
    className={`flex items-center md:grid grid-rows-3 gap-4 md:gap-0 p-4 md:h-56 bg-indigo-100 ${className}`}
  >
    <span className="row-start-2 md:mx-auto w-12 h-12 border-4 rounded-full"></span>
    <div className="row-start-3 flex-grow flex md:flex-col justify-between md:text-center leading-none">
      <div className="text-lg">{title}</div>
      <div className="font-medium">{subtitle}</div>
    </div>
  </li>
);
