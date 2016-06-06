import React, { Component } from 'react';

export default class Nutrient extends Component {

  render() {
    const { name, value } = this.props;
    return (
      <div>
        <span className="name">{name}</span>
        <span className="value">{value}</span>
      </div>
    );
  }
};