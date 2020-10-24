import React from "react";

export const Tile = ({
  Icon,
  title,
  subtitle,
  href,
  className = "text-indigo-500",
}) => (
  <li>
    <a
      href={href}
      className={`flex items-center md:grid grid-rows-3 gap-4 md:gap-0 p-4 md:h-56 hover:bg-red-400 hover:text-white bg-indigo-100 ${className}`}
    >
      <div className="row-start-2 md:mx-auto text-2xl">
        <Icon />
      </div>
      <div className="row-start-3 flex-grow flex md:flex-col justify-between md:text-center leading-none">
        <span className="text-lg">{title}</span>
        <span className="font-medium">{subtitle}</span>
      </div>
    </a>
  </li>
);
