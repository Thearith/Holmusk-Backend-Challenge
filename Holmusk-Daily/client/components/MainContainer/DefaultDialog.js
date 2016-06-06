import React, { Component } from 'react';


// DefaultDialog component, appears whenever a user is neither searching or toggle switch on

export default class DefaultDialog extends Component {
  render() {
    return (
      <div className="searchInfoContainer">
        <img src="/images/search.png" className="searchInfoIcon" />
        <span className="searchInfo">
          <b>Search</b> your <b>favorite</b> food now.
        </span>
        <span className="crawlInfo">
          <span className="crawlNumber">2000 </span>
          foods have been crawled from
          <a href="http://www.myfitnesspal.com/" target="_blank">myfitnesspal</a>
          .
        </span>

      </div>
    );
  }
};