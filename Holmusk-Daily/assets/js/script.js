// constants
var HOLMUSK_DAILY_BASE_URL      = "http://localhost:1337";
var HOLMUSK_DAILY_URL           = HOLMUSK_DAILY_BASE_URL;
var SEARCH_URL                  = HOLMUSK_DAILY_BASE_URL + "/search/";
var GET_FOOD_ENDPOINT           = HOLMUSK_DAILY_BASE_URL + "/food/";
var POST_FOOD_ENDPOINT          = HOLMUSK_DAILY_BASE_URL + "/food";

// keys of a food json
var ID                          = "id";
var TITLE                       = "title";
var LINK                        = "link";
var SERVING                     = "serving";
var CALORIES                    = "calories";
var TOTAL_FAT                   = "totalFat";
var SATURATED                   = "saturated";
var POLYUNSATURATED             = "polyunsaturated";
var MONOUNSATURATED             = "monounsaturated";
var TRANS                       = "trans";
var CHOLESTEROL                 = "cholesterol";
var SODIUM                      = "sodium";
var POTASSIUM                   = "potassium";
var TOTAL_CARBS                 = "totalCarbs";
var DIETARY_FIBRE               = "dietaryFiber";
var SUGARS                      = "sugars";
var PROTEIN                     = "protein";
var VITAMIN_A                   = "vitaminA";
var VITAMIN_C                   = "vitaminC";
var CALCIUM                     = "calcium";
var IRON                        = "iron";




/**
* REACT COMPONENTS
*/

// App component: containing everything

var App = React.createClass({
  getInitialState: function() {
    return {
      query: '',
      filteredData: [],
      isSearch: false,
      isSwitch: false
    }
  },

  doSearch: function(queryText) {

    if(queryText === '') {
      this.setState({
        query: '',
        filteredData: [],
        isSearch: false,
        isSwitch: false,
      });
      return;
    }

    var url = SEARCH_URL + queryText;

    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      success: function(response) {
        var results = response.results;
        this.setState({
          query: queryText,
          filteredData: results,
          isSearch: true,
          isSwitch: false
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },

  doSwitch: function(val) {
    console.log("switching pls");
    var pinnedResult = [];

    if(val == false) {
      this.setState({
        query: '',
        filteredData: [],
        isSearch: false,
        isSwitch: false,
      });
      return;
    }

    for(var i=0; i<localStorage.length; i++) {
      var id = localStorage.key(i);
      var title = localStorage.getItem(id);

      pinnedResult.push({
        id: id,
        title: title
      });
    }

    this.setState({
      query: '',
      filteredData: pinnedResult,
      isSearch: false,
      isSwitch: true,
    });

  },

  render: function() {
    return (
      <div>
        <Navbar
          query={this.state.query}
          doSearch={this.doSearch}
          doSwitch={this.doSwitch}
          isSearch={this.state.isSearch} />

        <MainContainer
          data={this.state.filteredData}
          isSearch={this.state.isSearch}
          query={this.state.query}
          isSwitch={this.state.isSwitch}
        />

      </div>
    );
  }
});


// Navbar component: containing switch, search and a modal trigger button

var Navbar = React.createClass({
  render: function() {
    return (
      <div className="navbar-fixed">
        <nav>
            <div className="nav-wrapper teal">
              <Logo />
              <NewFood doSwitch={this.props.doSwitch} isSearch={this.props.isSearch}/>
              <Search query={this.props.query} doSearch={this.props.doSearch}/>
          </div>
        </nav>
      </div>
    );
  }
});

var Logo = React.createClass({
  render: function() {
    return (
      <a href="http://localhost:1337" className="brand-logo logo-align">
        <img src={"/images/logo-white.png"} id="logo" />
        <h3 className="logo-header"> Holmusk Daily </h3>
      </a>
    );
  }
});

var NewFood = React.createClass({
  render: function() {
    return (
      <ul id="nav-mobile" className="right hide-on-small-only">
        <li>
          <ToggleSwitch doSwitch={this.props.doSwitch} isSearch={this.props.isSearch}/>
        </li>
        <li>
          <div className="new-event right">
                <a className="modal-trigger" href={"#modal-newevent"}>
                  <i className="medium material-icons left newevent-icon">add</i>
                  <span className="newevent-text">CREATE FOOD</span>
                </a>
          </div>
        </li>
      </ul>
    );
  }
});

var ToggleSwitch = React.createClass({
  doSwitch: function() {
    var switched = this.refs.switchInput.checked;
    this.props.doSwitch(switched);
  },

  render: function() {
    return (
      <div className="switch">
        <label>
          { !this.props.isSearch ?
            <input type="checkbox" ref="switchInput" onChange={this.doSwitch} /> :
            <input disabled type="checkbox" checked="false" ref="switchInput" onChange={this.doSwitch} />
          }
          <span className="lever"></span>
        </label>
      </div>
    );
  }
});

var Search = React.createClass ({
  doSearch: function(){
    var query=this.refs.searchInput.value; // this is the search text
    this.props.doSearch(query);
  },

  componentDidMount: function() {
    $('#search').on('keydown', this.handleKeyDown);
  },

  handleKeyDown: function(e) {
    var ENTER = 13;
      if( e.keyCode == ENTER ) {
        e.preventDefault();
        return false;
      }
  },

  render: function() {
    return (
      <form>
        <div className="input-field search-outer">
          <input id="search" type="text" placeholder="Search for foods" ref="searchInput" value={this.props.query} onChange={this.doSearch} />
          <label htmlFor="search">
            <i className="tiny material-icons search-icon">search</i>
          </label>
        </div>
      </form>
    );
  }
});


// MainContainer components, containing search results

var MainContainer = React.createClass({
  render: function() {

    return (
      <div className="container-fluid" id="main-container">
        <AdBanner />

        {this.props.isSearch || this.props.isSwitch ?
          <SearchContainer searchResults={this.props.data} query={this.props.query} isSearch={this.props.isSearch} isSwitch={this.props.isSwitch} /> :
          <NoSearchContainer />
        }

      </div>
    );
  }
});

var AdBanner = React.createClass({
  render: function() {
    var style = {
      paddingTop: "2px",
      paddingLeft: "3px"
    };

    return (
      <div className="row">
        <div className="col l10 m9 s12">
          <div className="col l2 hide-on-med-and-down">
            <div className="logo-large"></div>
          </div>
          <div className="col l10 m12 s12">
            <div className="card small">
              <a href="https://www.facebook.com/Holmusk-1579404252303964/" target="_blank">
                <div className="card-image">
                  <img src="/images/bg.jpg"></img>
                  <div className="intro-msg">
                    <div className="intro-title">Discover</div>
                    <div className="intro-content">your favorite food nutrients via Holmusk Daily.</div>
                    <div className="fb-iconsmall">
                      <img src="/images/facebook.png" style={style} />
                    </div>
                    <div className="intro-likefb">Like Holmusk on Facebook</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
})

var NoSearchContainer = React.createClass({
  render: function() {
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
})

var SearchContainer = React.createClass({
  render: function() {
    return (
      <div>
        {
          this.props.searchResults.length != 0 ?
            <ResultContainer searchResults={this.props.searchResults} isSearch={this.props.isSearch} isSwitch={this.props.isSwitch} />
            :
            <NoResultContainer isSearch={this.props.isSearch} isSwitch={this.props.isSwitch} />
        }
      </div>
    );
  }
});

var ResultContainer = React.createClass({
  render: function() {
    var length = this.props.searchResults.length;
    return (
      <div>
        {this.props.isSearch ?
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
            this.props.searchResults.map(function(result) {
              return (
                <Food title={result.title} id={result.id} />
              );
            })
          }
        </div>
      </div>
    );
  }
});

var NoResultContainer = React.createClass({
  render: function() {
    return (
      <div className="no-result-container">
        {
          this.props.isSearch ?
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
});

var Food = React.createClass({
  getInitialState: function() {
    return {
      food: null,
      pinned: false
    };
  },

  doPin: function() {
    var id = this.props.id;
    this.setState({pinned: !this.state.pinned});

    if(localStorage.getItem(id)) {
      localStorage.removeItem(id);
    } else {
      localStorage.setItem(id, this.props.title);
    }
  },

  componentDidMount: function() {

    $('.collapsible').collapsible({
      accordion : false
    });

    var url = GET_FOOD_ENDPOINT + this.props.id;

    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      success: function(response) {
        this.setState({
          food: response.food,
          pinned: localStorage.getItem(this.props.id) !== null
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    })
  },

  render: function() {
    var food = this.state.food;

    return (
      <div className="collapsible food-card" data-collapsible="accordion">
        <li>

          <div className="collapsible-header">
            <div className="card-content food-brief">

              <div className="row title-container">
                <div className="col s10">
                  <div className="card-title">
                    <span>{this.props.title}</span>
                  </div>
                </div>
                <div className="col s2">
                  <a className="pin" onClick={this.doPin} >
                    <img src={this.state.pinned ? "/images/pinned.png" : "/images/pin.png"} />
                  </a>
                </div>
              </div>

              { food != null ?
                <div>
                  <a className="food-link" href={food[LINK]} target="_blank">
                    {this.state.food[LINK]}
                  </a>

                  <div className="food-calories">
                    <span className="value">{food[CALORIES]}</span>
                    <span className="unit">kCal</span>
                  </div>

                  <div className="food-imp-nutrients">
                    <div className="food-carb">
                      <span className="name">Carb</span>
                      <span className="value">{food[TOTAL_CARBS]}</span>
                    </div>
                    <div className="food-protein">
                      <span className="name">Protein</span>
                      <span className="value">{food[PROTEIN]}</span>
                    </div>
                    <div className="food-fat">
                      <span className="name">Fat</span>
                      <span className="value">{food[TOTAL_FAT]}</span>
                    </div>
                  </div>

                </div>

                :

                <span className="loading">Loading ...</span>
              }

            </div>
          </div>

          <div className="collapsible-body food-details">

            { food != null ?
              <div>
                <div className="food-details-row">
                  <div className="food-sugar">
                    <span className="name">Sugar</span>
                    <span className="value">{food[SUGARS]}</span>
                  </div>

                  <div className="food-fibre">
                    <span className="name">Fibre</span>
                    <span className="value">{food[DIETARY_FIBRE]}</span>
                  </div>
                </div>

                <div className="food-details-row">
                  <div className="food-sodium">
                    <span className="name">Sodium</span>
                    <span className="value">{food[SODIUM]}</span>
                  </div>

                  <div className="food-potassium">
                    <span className="name">Potassium</span>
                    <span className="value">{food[POTASSIUM]}</span>
                  </div>
                </div>

                <div className="food-details-row">
                  <div className="food-iron">
                    <span className="name">Iron</span>
                    <span className="value">{food[IRON]}</span>
                  </div>

                  <div className="food-calcium">
                    <span className="name">Calcium</span>
                    <span className="value">{food[CALCIUM]}</span>
                  </div>
                </div>

                <div className="food-details-row">
                  <div className="food-sugar">
                    <span className="name">Sugar</span>
                    <span className="value">{food[SUGARS]}</span>
                  </div>

                  <div className="food-fibre">
                    <span className="name">Fibre</span>
                    <span className="value">{food[DIETARY_FIBRE]}</span>
                  </div>
                </div>

                <div className="food-details-row">
                  <div className="food-vitamin-a">
                    <span className="name">Vitamin A</span>
                    <span className="value">{food[VITAMIN_A]}</span>
                  </div>

                  <div className="food-vitamin-c">
                    <span className="name">Vitamin C</span>
                    <span className="value">{food[VITAMIN_C]}</span>
                  </div>
                </div>

                <div className="food-details-row">
                  <div className="food-saturated">
                    <span className="name">Saturated</span>
                    <span className="value">{food[SATURATED]}</span>
                  </div>

                  <div className="food-trans">
                    <span className="name">Trans</span>
                    <span className="value">{food[TRANS]}</span>
                  </div>
                </div>

                <div className="food-details-row">
                  <div className="food-mono-saturated">
                    <span className="name">Mono Unsat</span>
                    <span className="value">{food[MONOUNSATURATED]}</span>
                  </div>

                  <div className="food-poly-saturated">
                    <span className="name">Poly Unsat</span>
                    <span className="value">{food[POLYUNSATURATED]}</span>
                  </div>
                </div>

              </div>

              :

              <span className="loading">Loading ...</span>
            }
          </div>

        </li>
      </div>
    );
  }
})


ReactDOM.render(
  <App />,
  document.getElementById('App')
);