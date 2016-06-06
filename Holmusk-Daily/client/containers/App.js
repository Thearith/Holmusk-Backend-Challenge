import React, { Component } from 'react';

import Navbar from '../components/Navbar/Navbar';
import MainContainer from '../components/MainContainer/MainContainer';
import ModalForm from '../components/ModalForm/ModalForm';
import { SEARCH_URL } from '../constants/ApiEndpoints';


/**********************************************************************
* ReactDOM renders App component to a div with element id, "App"
***********************************************************************/

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: '',
      filteredData: [],
      isSearch: false,
      isSwitch: false
    };

    this.doSearch = this.doSearch.bind(this);
    this.doSwitch = this.doSwitch.bind(this);
  }


  // Callback search method, search querytext via SEARCH_URL (elasticsearch)
  // and pass the results for MainContainer component to populate
  doSearch(queryText) {
    if(queryText === '') {
      this.setState({
        query: '',
        filteredData: [],
        isSearch: false,
        isSwitch: false,
      });
      return;
    }

    const url = SEARCH_URL + queryText;

    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json'
    })
      .done(response => {
        const results = response.results;
        this.setState({
          query: queryText,
          filteredData: results,
          isSearch: true,
          isSwitch: false
        });
      })
      .fail((xhr, status, err) => {
        console.error(url, status, err.toString());
      });
  }


  // Callback switch method, get users' pinned food (stored in localStorage)
  // and pass the results for MainContainer component to populate
  doSwitch(val) {
    let pinnedResult = [];

    if(!val) {
      this.setState({
        query: '',
        filteredData: [],
        isSearch: false,
        isSwitch: false,
      });
      return;
    }

    Object.keys(localStorage).forEach(key => {
      const title = localStorage.getItem(key);

      pinnedResult.push({
        id: key,
        title: title
      });
    });

    this.setState({
      query: '',
      filteredData: pinnedResult,
      isSearch: false,
      isSwitch: true,
    });
  }

  render() {
    const { filteredData, isSwitch, isSearch, query } = this.state;
    return (
      <div>
        <Navbar
          query={query}
          doSearch={this.doSearch}
          doSwitch={this.doSwitch}
          isSearch={isSearch} />

        <MainContainer
          filteredData={filteredData}
          isSearch={isSearch}
          query={query}
          isSwitch={isSwitch} />

        <ModalForm />

      </div>
    );
  }

};