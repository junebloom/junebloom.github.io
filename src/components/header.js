import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import logo from "../images/logo-square.svg";

const Header = ({ siteTitle }) => {
  const [scrolled, setScrolled] = useState(false);

  function handleScroll() {
    const isScrolled = document.scrollingElement.scrollTop > 0;
    if (scrolled !== isScrolled) setScrolled(isScrolled);
  }

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  });

  let className = `fixed z-20 p-4 w-full flex items-center justify-between transition-colors duration-200 xl:bg-transparent xl:pointer-events-none`;
  if (scrolled) className += ` bg-white`;

  return (
    <header className={className}>
      <Link to="/" className="pointer-events-auto bg-white rounded-full">
        <img src={logo} className="w-8 h-8 m-4" />
      </Link>
      <nav className="space-x-2 pointer-events-auto m-4">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
        <a href="https://github.com/junebloom">GitHub</a>
      </nav>
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
