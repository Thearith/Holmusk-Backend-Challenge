import React, { Component } from 'react';

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.doSearch = this.doSearch.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  doSearch() {
    const query = this.refs.searchInput.value; // this is the search text
    this.props.doSearch(query);
  }

  handleKeyDown(event) {
    const ENTER = 13;
    if(event.keyCode == ENTER ) {
      event.preventDefault();
      return false;
    }
  }

  handleKeyUp(event) {

  }

  render() {
    const { query } = this.props;
    return (
      <form>
        <div className="input-field search-outer">
          <input
            id="search"
            type="text"
            placeholder="Search for foods"
            ref="searchInput"
            value={query}
            onChange={this.doSearch}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp} />
          <label htmlFor="search">
            <i className="tiny material-icons search-icon">search</i>
          </label>
        </div>
      </form>
    );
  }
};