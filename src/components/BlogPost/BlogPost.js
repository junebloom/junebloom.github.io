import React from "react";
import { formatInteger } from "./formatInteger.js";
import "./prism-theme.css";

export const BlogPost = ({ title, date, timeToRead, html }) => (
  <article className="flex flex-col items-center text-center space-y-4">
    <h1 className="text-5xl font-black leading-none text-indigo-500 max-w-lg">
      {title}
    </h1>

    <h2 className="space-x-2 text-xl text-indigo-600">
      <span>{date}</span>
      <span>·</span>
      <span>{`${formatInteger(timeToRead)} minute read`}</span>
    </h2>

    <div
      className="text-left prose max-w-none w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  </article>
);
