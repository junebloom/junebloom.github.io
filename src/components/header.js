import { Link } from "gatsby";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

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

  let className = `fixed z-20 w-full flex justify-between p-8 transition-colors duration-200 xl:bg-transparent xl:pointer-events-none`;
  if (scrolled) className += ` bg-white`;

  return (
    <header className={className}>
      <Link
        to="/"
        className="text-2xl leading-none font-black text-indigo-500 pointer-events-auto"
      >
        j
      </Link>
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
