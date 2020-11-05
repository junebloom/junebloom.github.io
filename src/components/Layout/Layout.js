import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import { RiCopyleftLine } from "react-icons/ri";
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
      <footer className="flex items-center justify-center space-x-1 m-16 text-sm text-indigo-500 font-bold">
        <RiCopyleftLine title="copyleft">🄯</RiCopyleftLine>
        <span>{new Date().getFullYear()} - All wrongs reversed.</span>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
