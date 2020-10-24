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

  let className = `fixed z-50 w-full flex justify-between p-8 transition-colors duration-200 lg:bg-transparent`;
  if (scrolled) className += ` bg-white`;

  return (
    <header className={className}>
      <Link to="/" className="text-2xl leading-none font-black text-indigo-500">
        j
      </Link>
      <Link to="#" className="text-indigo-500">
        menu
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
