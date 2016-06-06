import React, { Component } from 'react';


// NotFoundDialog component, appears when the search results is empty
// Show appropriate content to tell users that the search is empty

export default class NotFoundDialog extends Component {
  render() {
    const { isSearch } = this.props;
    return (
      <div className="no-result-container">
        { isSearch ?
          <div className="no-search-result">
            <img src="/images/noSearch.png" />
            <span> No results found </span>
          </div>

          :

          <div className="no-pinned-result">
            <img src="/images/noPin.png" />
            <span> You have not pinned any food.</span>
          </div>

        }
      </div>
    );
  }
};