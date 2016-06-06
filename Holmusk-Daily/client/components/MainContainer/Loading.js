import React, { Component } from 'react';

export default class Loading extends Component {

  render() {
    return (
      <div className="row loading">
        <div className="col s12 m12 center">
          <div className="preloader-wrapper active">
            <div className="spinner-layer spinner-yellow-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div>
              <div className="gap-patch">
                <div className="circle"></div>
              </div>
              <div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}