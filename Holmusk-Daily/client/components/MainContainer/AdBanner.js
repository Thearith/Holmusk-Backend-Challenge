import React, { Component } from 'react';

// AdBanner component, just showcasing Holmusk and provide a link to Holmusk's facebook page

export default class AdBanner extends Component {
  render() {
    return (
      <div className="row">
        <div className="col l8 m10 s12 offset-l2 offset-m1">
          <div className="card small">
            <a href="https://www.facebook.com/Holmusk-1579404252303964/" target="_blank">
              <div className="card-image">
                <img src="/images/bg.jpg"></img>
                <div className="intro-msg">
                  <div className="intro-title">Discover</div>
                  <div className="intro-content">your favorite food nutrients via Holmusk Daily.</div>
                  <div className="fb-iconsmall">
                    <img src="/images/facebook.png" />
                  </div>
                  <div className="intro-likefb">Like Holmusk on Facebook</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
};