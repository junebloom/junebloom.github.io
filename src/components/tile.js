import React from "react";

export const Tile = ({
  title,
  subtitle,
  className = "border-indigo-500 text-indigo-500",
}) => (
  <li
    className={`relative flex md:flex-col items-center md:justify-center flex-grow md:h-56 p-2 bg-indigo-100 ${className}`}
  >
    <span className={`m-2 w-16 h-16 border-4 rounded-full ${className}`}></span>
    <div className="md:absolute md:bottom-0 flex flex-grow md:flex-col md:items-center justify-between md:text-center leading-none">
      <div className="text-lg m-2 md:m-0">{title}</div>
      <div className="font-medium m-2 md:m-0 md:mb-6">{subtitle}</div>
    </div>
  </li>
);
