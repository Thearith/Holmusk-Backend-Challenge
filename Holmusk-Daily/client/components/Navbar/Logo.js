import React, { Component } from 'react';

export default class Logo extends Component {
  render() {
    return (
      <a href="/" className="brand-logo logo-align hide-on-med-and-down">
        <img src={"/images/logo-white.png"} id="logo" />
        <h3 className="logo-header"> Holmusk Daily </h3>
      </a>
    );
  }
};