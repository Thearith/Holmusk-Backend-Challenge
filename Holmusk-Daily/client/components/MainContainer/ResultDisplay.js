import React, { Component } from 'react';

import Food from './Food';

// ResultDisplay component, appears when the search results is not empty
// populates all foods

export default class ResultDisplay extends Component {
  render() {
    const { searchResults, isSwitch, isSearch } = this.props;
    const length = searchResults.length;
    return (
      <div>
        { isSearch ?
          <div className="result-container">
            <span className="search-number-display">
              Displaying <b>{length}</b> result{length != 1 ? "s" : ""}
            </span>
            <hr/>
          </div>
          :
          <div className="result-container">
            <span className="pinned-number-display">
              Displaying <b>{length}</b> pinned food{length != 1 ? "s" : ""}
            </span>
            <hr/>
          </div>
        }

        <div className="row foods-container">
          {
            searchResults.map((result, index) => {
              return (
                <Food
                  title={result.title}
                  id={result.id}
                  isSwitch={isSwitch}
                  key={index} />
              );
            })
          }
        </div>
      </div>
    );
  }
};