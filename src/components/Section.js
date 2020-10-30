import React from "react";

export const Section = ({ title, children }) => (
  <section className="flex flex-col space-y-2">
    <h2 className="font-bold text-indigo-600 p-2">{title}</h2>
    {children}
  </section>
);
