import React, { Component } from 'react';

export default class ToggleSwitch extends Component {

  constructor(props) {
    super(props);

    this.doSwitch = this.doSwitch.bind(this);
  }

  doSwitch() {
    const switched = this.refs.switchInput.checked;
    this.props.doSwitch(switched);
  }

  render() {
    const { isSearch } = this.props;
    return (
      <div className="switch">
        <label>
          <input
            disabled={isSearch}
            type="checkbox"
            checked="false"
            ref="switchInput"
            onChange={this.doSwitch} />
          <span className="lever"></span>
        </label>
      </div>
    );
  }

};
