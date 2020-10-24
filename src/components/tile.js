import React from "react";

export const Tile = ({ title, subtitle, className = "text-indigo-500" }) => (
  <li
    className={`flex-grow flex items-center md:grid grid-rows-3 space-x-4 md:space-x-0 md:h-56 p-4 bg-indigo-100 ${className}`}
  >
    <span className="row-start-2 md:mx-auto w-16 h-16 border-4 rounded-full"></span>
    <div className="row-start-3 flex-grow flex md:flex-col justify-between md:text-center leading-none">
      <div className="text-lg">{title}</div>
      <div className="font-medium">{subtitle}</div>
    </div>
  </li>
);
