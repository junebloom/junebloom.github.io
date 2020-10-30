import React from "react";
import { Link } from "gatsby";
import { formatInteger } from "./formatInteger.js";

export const BlogPostPreview = ({ title, slug, date, timeToRead, excerpt }) => (
  <article className="flex flex-col items-center text-center space-y-4">
    <Link
      to={slug}
      className="text-5xl font-black leading-none text-indigo-500 max-w-lg"
    >
      {title}
    </Link>

    <div className="space-x-2 text-xl text-indigo-400">
      <span>{date}</span>
      <span>·</span>
      <span>{`${formatInteger(timeToRead)} minute read`}</span>
    </div>

    <p className="text-left prose max-w-none w-full">
      {excerpt} <Link to={slug}>read more</Link>
    </p>
  </article>
);
