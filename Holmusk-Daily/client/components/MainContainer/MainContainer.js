import React, { Component } from 'react';

import AdBanner from './AdBanner';
import SearchDisplay from './SearchDisplay';
import DefaultDialog from './DefaultDialog';


/*
* MainContainer component, containing all Search or Pinned food results
* which are passed down as props from App component
*/

export default class MainContainer extends Component {

  render() {
    const { isSearch, isSwitch, filteredData, query } = this.props;
    return (
      <div className="container-fluid" id="main-container">
        <AdBanner />

        { isSearch || isSwitch ?
          <SearchDisplay
            searchResults={filteredData}
            query={query}
            isSearch={isSearch}
            isSwitch={isSwitch} /> :

          <DefaultDialog />
        }
      </div>
    );
  }
};