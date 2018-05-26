import React from "react";
import propTypes from "prop-types";

const Header = props => (
  <div className="list-books-title">
    <h1>{props.title}</h1>
  </div>
);

Header.propTypes = {
  title: propTypes.string.isRequired
};

Header.defaultProps = {
  title: "MyReads"
};

export default Header;
