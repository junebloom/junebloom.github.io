import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

const Header = ({ siteTitle }) => (
  <header className="absolute w-full flex justify-between p-12">
    <Link to="/" className="font-black">
      j
    </Link>
    <Link to="#">menu</Link>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
