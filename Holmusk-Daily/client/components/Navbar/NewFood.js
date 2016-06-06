import React, { Component } from 'react';

import ToggleSwitch from './ToggleSwitch';


export default class NewFood extends Component {
  render() {
    const { doSwitch, isSearch } = this.props;
    return (
      <ul id="nav-mobile" className="right hide-on-small-only">
        <li>
          <ToggleSwitch
            doSwitch={doSwitch}
            isSearch={isSearch} />
        </li>
        <li>
          <div className="new-food right">
            <a className="modal-trigger" href="#modal-newfood">
              <i className="medium material-icons left newfood-icon">add</i>
              <span className="newfood-text">CREATE FOOD</span>
            </a>
          </div>
        </li>
      </ul>
    );
  }
};