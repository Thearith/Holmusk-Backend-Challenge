import React, { Component } from 'react';

import ResultDisplay from './ResultDisplay';
import NotFoundDialog from './NotFoundDialog';


// SearchDisplay, appears whenever a user is either searching or toggle switch on
// gets all food results from App component

export default class SearchDisplay extends Component {
  render() {
    const { searchResults, isSearch, isSwitch } = this.props;
    return (
      <div>
        { searchResults.length != 0 ?
          <ResultDisplay
            searchResults={searchResults}
            isSearch={isSearch}
            isSwitch={isSwitch} />
          :
          <NotFoundDialog
            isSearch={isSearch}
            isSwitch={isSwitch} />
        }
      </div>
    );
  }
};