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

var JSON_INDEX                  = 0;
var SHORT_NAME_INDEX            = 1;

var IMPORTANT_NUTRIENTS = [
  [TOTAL_CARBS, "Carb"],
  [PROTEIN, "Protein"],
  [TOTAL_FAT, "Fat"]
];

var OTHER_NUTRIENTS = [
  [
    [SUGARS, "Sugars"],
    [DIETARY_FIBRE, "Fibre"]
  ],
  [
    [SODIUM, "Sodium"],
    [POTASSIUM, "Potassium"]
  ],
  [
    [IRON, "Iron"],
    [CALCIUM, "Calcium"]
  ],
  [
    [VITAMIN_A, "Vitamin A"],
    [VITAMIN_C, "Vitamin C"]
  ],
  [
    [SATURATED, "Saturated"],
    [TRANS, "Trans"]
  ],
  [
    [MONOUNSATURATED, "Mono Unsat"],
    [POLYUNSATURATED, "Poly Unsat"]
  ]
];



/*************************************************************
*
* REACT COMPONENTS
*
**************************************************************/

/*
* App component: containing everything
*/

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
          isSwitch={this.state.isSwitch} />

        <ModalForm />

      </div>
    );
  }
});


/*
* Navbar component: containing switch, search and a modal trigger button
*/

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
      <a href="http://localhost:1337" className="brand-logo logo-align hide-on-med-and-down">
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
          <div className="new-food right">
                <a className="modal-trigger" href={"#modal-newfood"}>
                  <i className="medium material-icons left newfood-icon">add</i>
                  <span className="newfood-text">CREATE FOOD</span>
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

  handleKeyDown: function(e) {
    var ENTER = 13;
      if( e.keyCode == ENTER ) {
        e.preventDefault();
        return false;
      }
  },

  handleKeyUp: function(e) {
    delay(function(){

    }, 1000 );
  },

  render: function() {
    return (
      <form>
        <div className="input-field search-outer">
          <input id="search" type="text" placeholder="Search for foods" ref="searchInput" value={this.props.query} onChange={this.doSearch} onKeyDown={this.handleKeyDown} />
          <label htmlFor="search">
            <i className="tiny material-icons search-icon">search</i>
          </label>
        </div>
      </form>
    );
  }
});



/*
* MainContainer component, containing search food results and pinned foods
*/

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
        <div className="col l8 m10 s12 offset-l2 offset-m1">
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
    );
  }
});

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
});

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
                <Food title={result.title} id={result.id} importantNutrients={IMPORTANT_NUTRIENTS}
                  otherNutrients={OTHER_NUTRIENTS} />
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
      pinned: false,
      showClickMore: true
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

  getFood: function() {
    this.setState({
      showClickMore: false
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

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      showClickMore: true,
      pinned: false,
      food: null
    });
  },

  componentDidMount: function() {
    $('.collapsible').collapsible({
      accordion : false
    });
  },

  render: function() {
    var food = this.state.food;

    return (
      <div className="collapsible food-card" data-collapsible="accordion">
        <li>

          <div className="collapsible-header" onClick={this.state.showClickMore ? this.getFood : null}>
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
                  { food[LINK] !== undefined && food[LINK] !== null ?
                    <a className="food-link" href={food[LINK]} target="_blank">
                      {food[LINK]}
                    </a> : null
                  }

                  <div className="nutrientContainer">

                    <div className="food-calories">
                      <span className="value">{food[CALORIES]}</span>
                      <span className="unit">cal</span>
                    </div>

                    <div className="food-cholesterol">
                      <span className="name">Cholesterol</span>
                      <span className="value">{food[CHOLESTEROL]}</span>
                    </div>

                    <div className="food-imp-nutrients">
                      {
                        this.props.importantNutrients.map(function(nutrient, index) {
                          var jsonIndex = nutrient[JSON_INDEX];
                          var shortName = nutrient[SHORT_NAME_INDEX];

                          return (
                            <Nutrient name={shortName} value={food[jsonIndex]} />
                          );
                        })
                      }
                    </div>
                  </div>
                </div>

                :

                <div className="showMoreContainer">
                  { this.state.showClickMore ?
                    <span className="showClickMore">Click here to see more</span>
                    :
                    <span className="loading-text">Loading ...</span>
                  }
                </div>
              }

            </div>
          </div>

          <div className="collapsible-body food-details">
            { food != null ?
              <div>
                <div className="food-serving">
                  <span>Serving: {food[SERVING]} </span>
                </div>
                <div>
                  {
                    this.props.otherNutrients.map(function(nutrientArray, index) {
                      var nutrient1 = nutrientArray[0];
                      var nutrient2 = nutrientArray[1];
                      var nutrient1JsonIndex = nutrient1[JSON_INDEX];
                      var nutrient2JsonIndex = nutrient2[JSON_INDEX];

                      return (
                        <div className="food-details-row">
                          <Nutrient name={nutrient1[SHORT_NAME_INDEX]} value={food[nutrient1JsonIndex]} />
                          <Nutrient name={nutrient2[SHORT_NAME_INDEX]} value={food[nutrient2JsonIndex]} />
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              :
              <Loading />
            }
          </div>
        </li>
      </div>
    );
  }
});

var Nutrient = React.createClass({
  render: function() {
    return (
      <div>
        <span className="name">{this.props.name}</span>
        <span className="value">{this.props.value}</span>
      </div>
    );
  }
});

var Loading = React.createClass({
  render: function() {
    return (
      <div className="row loading">
        <div className="col s12 m12 center">
          <div className="preloader-wrapper active">
              <div className="spinner-layer spinner-yellow-only">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div>
                  <div className="gap-patch">
                    <div className="circle"></div>
                  </div>
                  <div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
});

/*
* Modal: containing a form for user to submit a new food
*/

var ModalForm = React.createClass({

  clearForm: function() {
    this.refs.title.value       = '';
    this.refs.calories.value    = '';
    this.refs.cholesterol.value = '';
    this.refs.carb.value        = '';
    this.refs.protein.value     = '';
    this.refs.fat.value         = '';
    this.refs.sugars.value      = '';
    this.refs.fibre.value       = '';
    this.refs.sodium.value      = '';
    this.refs.potassium.value   = '';
    this.refs.iron.value        = '';
    this.refs.calcium.value     = '';
    this.refs.vitamin_a.value   = '';
    this.refs.vitamin_c.value   = '';
    this.refs.saturated.value   = '';
    this.refs.trans.value       = '';
    this.refs.poly_unsat.value  = '';
    this.refs.mono_unsat.value  = '';

  },

  handleSubmit: function(e) {

    e.preventDefault();

    var title = this.refs.title.value;
    var calories = this.refs.calories.value;
    var totalCarbs = this.refs.carb.value;
    var protein = this.refs.protein.value;
    var totalFat = this.refs.fat.value;
    var sugars = this.refs.sugars.value;
    var dietaryFiber = this.refs.fibre.value;
    var sodium = this.refs.sodium.value;
    var potassium = this.refs.potassium.value;
    var iron = this.refs.iron.value;
    var calcium = this.refs.calcium.value;
    var vitaminA = this.refs.vitamin_a.value;
    var vitaminC = this.refs.vitamin_c.value;
    var saturated = this.refs.saturated.value;
    var trans = this.refs.trans.value;
    var polyunsaturated = this.refs.poly_unsat.value;
    var monounsaturated = this.refs.mono_unsat.value;

    title = checkNotNull(title) ? title : "Generic food title";
    calories = checkNotNull(calories) ? calories : 0;
    totalCarbs = checkNotNull(totalCarbs) ? totalCarbs : 0;
    protein = checkNotNull(protein) ? protein : 0;
    sugars = checkNotNull(sugars) ? sugars : 0;
    dietaryFiber = checkNotNull(dietaryFiber) ? dietaryFiber : 0;
    sodium = checkNotNull(sodium) ? sodium : 0;
    potassium = checkNotNull(potassium) ? potassium : 0;
    iron = checkNotNull(iron) ? iron : 0;
    calcium = checkNotNull(calcium) ? calcium : 0;
    vitaminA = checkNotNull(vitaminA) ? vitaminA : 0;
    vitaminC = checkNotNull(vitaminC) ? vitaminC : 0;
    saturated = checkNotNull(saturated) ? saturated : 0;
    trans = checkNotNull(trans) ? trans : 0;
    polyunsaturated = checkNotNull(polyunsaturated) ? polyunsaturated : 0;
    monounsaturated = checkNotNull(monounsaturated) ? monounsaturated : 0;

    var postJson = {
      title: title,
      calories: calories,
      totalCarbs: totalCarbs,
      protein: protein,
      totalFat: totalFat,
      sugars: sugars,
      dietaryFiber: dietaryFiber,
      sodium: sodium,
      potassium: potassium,
      iron: iron,
      calcium: calcium,
      vitaminA: vitaminA,
      vitaminC: vitaminC,
      saturated: saturated,
      trans: trans,
      polyunsaturated: polyunsaturated,
      monounsaturated: monounsaturated
    };

    $.ajax({
      url: POST_FOOD_ENDPOINT,
      dataType: 'json',
      type: 'POST',
      data: postJson,
      success: function(data) {
        console.log("success post " + data.title);
        alert("Your food has been submitted to Holmusk Daily. Thank you for your submission!");

      }.bind(this),
      error: function(xhr, status, err) {
        console.log("error");
        console.error(this.props.urlPost, status, err.toString());
      }.bind(this)
    });

    this.exitModal();
  },

  componentDidMount: function() {
    $('.modal-trigger').leanModal();
  },

  exitModal: function(e) {
    this.clearForm();
    $('#modal-newfood').closeModal();
  },

  render: function() {
    return (
      <div>
        <div id="modal-newfood" className="modal">
          <div className="modal-content">
            <div className="row">
              <div className="col s10">
                <h4>Store new food</h4>
              </div>
              <div className="col s2 modal-title">
                <i className="material-icons medium modal-close right closeSign" onClick={this.exitModal}>clear</i>
              </div>
            </div>
            <div className="row">
              <form className="col s12" onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="input-field col s12">
                    <i className="material-icons medium prefix">announcement</i>
                    <input id="food_title" type="text" className="validate" ref="title"/>
                    <label htmlFor="food_title">Food Title</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_calories" type="number" className="validate" ref="calories" min="0"/>
                    <label htmlFor="food_calories">Calories</label>
                  </div>

                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_cholesterol" type="number" className="validate" ref="cholesterol" min="0"/>
                    <label htmlFor="food_cholesterol">Cholesterol</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_carb" type="number" className="validate" ref="carb" min="0"/>
                    <label htmlFor="food_carb">Carbohydrate</label>
                  </div>

                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_protein" type="number" className="validate" ref="protein" min="0"/>
                    <label htmlFor="food_protein">Protein</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_fat" type="number" className="validate" ref="fat" min="0"/>
                    <label htmlFor="food_fat">Fat</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_sugars" type="number" className="validate" ref="sugars" min="0"/>
                    <label htmlFor="food_sugars">Sugars</label>
                  </div>
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_fibre" type="number" className="validate" ref="fibre" min="0"/>
                    <label htmlFor="food_fibre">Fibre</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_sodium" type="number" className="validate" ref="sodium" min="0"/>
                    <label htmlFor="food_sodium">Sodium</label>
                  </div>

                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_potassium" type="number" className="validate" ref="potassium" min="0"/>
                    <label htmlFor="food_potassium">Potassium</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_iron" type="number" className="validate" ref="iron" min="0"/>
                    <label htmlFor="food_iron">Iron</label>
                  </div>

                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_calcium" type="number" className="validate" ref="calcium" min="0"/>
                    <label htmlFor="food_calcium">Calcium</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_vitamin_a" type="number" className="validate" ref="vitamin_a" min="0"/>
                    <label htmlFor="food_vitamin_a">Vitamin A</label>
                  </div>

                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_vitamin_c" type="number" className="validate" ref="vitamin_c" min="0"/>
                    <label htmlFor="food_vitamin_c">Vitamin C</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_saturated" type="number" className="validate" ref="saturated" min="0"/>
                    <label htmlFor="food_saturated">Saturated</label>
                  </div>

                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_trans" type="number" className="validate" ref="trans" min="0"/>
                    <label htmlFor="food_trans">Trans</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_poly_unsat" type="number" className="validate" ref="poly_unsat" min="0"/>
                    <label htmlFor="food_poly_unsat">Polyunsaturated</label>
                  </div>

                  <div className="input-field col m6 s12">
                    <i className="material-icons medium prefix">restaurant</i>
                    <input id="food_mono_unsat" type="number" className="validate" ref="mono_unsat" min="0"/>
                    <label htmlFor="food_mono_unsat">Monounsaturated</label>
                  </div>
                </div>

                <div className="button-container">
                  <button className="modal-action btn teal lighten-2 waves-effect waves-light right" value="Post">
                    Submit
                    <i className="material-icons medium right">send</i>
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

});


// helper functions

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

function checkNotNull(val) {
  return val && val !== undefined && val !== null && val !== '';
}


ReactDOM.render(
  <App />,
  document.getElementById('App')
);