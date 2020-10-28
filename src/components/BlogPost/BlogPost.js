import React from "react";
import { formatInteger } from "./formatInteger.js";
import "./prism-theme.css";

export const BlogPost = ({ title, slug, date, timeToRead, children }) => (
  <div className="flex flex-col items-center text-center space-y-4">
    <h1 className="text-5xl font-black leading-none text-indigo-500 max-w-lg">
      {title}
    </h1>

    <div className="space-x-2 text-xl text-indigo-400">
      <span>{date}</span>
      <span>·</span>
      <span>{`${formatInteger(timeToRead)} minute read`}</span>
    </div>

    <div className="text-left leading-7 text-indigo-900">{children}</div>
  </div>
);
