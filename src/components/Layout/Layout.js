import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import { Header } from "../Header.js";
import "./Layout.css";

export function Layout({ children }) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className="flex flex-col min-h-screen">
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <main className="flex-grow flex flex-col items-stretch">{children}</main>
      <footer className="m-16 text-center text-sm text-indigo-400 font-bold">
        🄯 {new Date().getFullYear()} - All wrongs reversed.
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
