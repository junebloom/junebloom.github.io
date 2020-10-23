import { Link } from "gatsby";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

const Header = ({ siteTitle }) => {
  const [scrolled, setScrolled] = useState(false);

  function handleScroll() {
    const { scrollTop } = document.scrollingElement;
    if (scrolled !== scrollTop > 0) setScrolled(scrollTop > 0);
  }

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  });

  let className = `fixed z-50 w-full flex justify-between p-8 lg:bg-transparent`;
  if (scrolled) className += ` bg-white`;

  return (
    <header className={className}>
      <Link to="/" className="font-black">
        j
      </Link>
      <Link to="#">menu</Link>
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
