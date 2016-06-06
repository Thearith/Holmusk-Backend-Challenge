import React, { Component } from 'react';

import Logo from './Logo';
import NewFood from './NewFood';
import Search from './Search';

export default class Navbar extends Component {
  render() {
    const { doSwitch, isSearch, query, doSearch } = this.props;
    return (
      <div className="navbar-fixed">
        <nav>
            <div className="nav-wrapper teal">
              <Logo />
              <NewFood doSwitch={doSwitch} isSearch={isSearch}/>
              <Search query={query} doSearch={doSearch}/>
          </div>
        </nav>
      </div>
    );
  }

};