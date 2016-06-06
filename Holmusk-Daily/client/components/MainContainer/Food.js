import React, { Component } from 'react';

import Nutrient from './Nutrient';
import Loading from './Loading';
import { GET_FOOD_ENDPOINT } from '../../constants/ApiEndpoints';
import { Keys, ImportantNutrients, OtherNutrients } from '../../constants/Nutrients';
import {
  LINK,
  SERVING,
  CALORIES,
  CHOLESTEROL
} from '../../constants/JSONKeys';

// Food component: showing all Food's information including title, link to fitnesspal page, and all other important nutrients
//    In Search mode, Food will only make a GET request if the user clicks on "click here to show more"
//        (so that web app does not lag too much when searching)
//    In Toggle switch on mode, Food will make a GET request immediately to populate data

export default class Food extends Component {

  constructor(props) {
    super(props);

    this.state = {
      food: null,
      pinned: this.props.isSwitch,
      showClickMore: true
    };

    this.doPin = this.doPin.bind(this);
    this.getFood = this.getFood.bind(this);
  }

  doPin() {
    const { id, title} = this.props;
    const { pinned } = this.state;
    this.setState({
      pinned: !pinned
    });

    if(localStorage.getItem(id)) {
      localStorage.removeItem(id);
    } else {
      localStorage.setItem(id, title);
    }
  }

  getFood() {

    this.setState({
      showClickMore: false
    });

    const { id } = this.props;
    const url = GET_FOOD_ENDPOINT + id;

    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json'
    })
      .done(response => {
        this.setState({
          food: response.food,
          pinned: localStorage.getItem(id) !== null
        });
      })
      .fail((xhr, status, err) => {
        console.error(url, status, err.toString());
      });
  }

  componentWillReceiveProps() {
    const { isSwitch } = this.props;

    if(!isSwitch) {
      this.setState({
        showClickMore: true,
        food: null
      });
    } else {
      this.getFood();
    }
  }

  componentDidMount() {
    $('.collapsible').collapsible({
      accordion : false
    });

    const { isSwitch, id } = this.props;

    if(isSwitch) {
      this.getFood(id);
    }
  }

  render() {
    const { title, id } = this.props;
    const { food, showClickMore, pinned } = this.state;

    return (
      <div className="collapsible food-card" data-collapsible="accordion">
        <li>

          <div className="collapsible-header" onClick={showClickMore ? this.getFood : null}>
            <div className="card-content food-brief">

              <div className="row title-container">
                <div className="col s10">
                  <div className="card-title">
                    <span>{title}</span>
                  </div>
                </div>
                <div className="col s2">
                  <a className="pin" onClick={this.doPin} >
                    <img src={pinned ? "/images/pinned.png" : "/images/pin.png"} />
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
                      { ImportantNutrients.map((nutrient, index) => {
                          const jsonIndex = nutrient[Keys.JSON_INDEX];
                          const shortName = nutrient[Keys.SHORT_NAME_INDEX];
                          return (
                            <Nutrient
                              name={shortName}
                              value={food[jsonIndex]}
                              key={index + "9xsed"} />
                          );
                        })
                      }
                    </div>
                  </div>
                </div>

                :

                <div className="showMoreContainer">
                  { showClickMore ?
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
                    OtherNutrients.map((nutrientArray, index) => {
                      const nutrient1 = nutrientArray[0];
                      const nutrient2 = nutrientArray[1];
                      const nutrient1JsonIndex = nutrient1[Keys.JSON_INDEX];
                      const nutrient2JsonIndex = nutrient2[Keys.JSON_INDEX];

                      return (
                        <div className="food-details-row">
                          <Nutrient
                            name={nutrient1[Keys.SHORT_NAME_INDEX]}
                            value={food[nutrient1JsonIndex]}
                            key={"0" + index} />
                          <Nutrient
                            name={nutrient2[Keys.SHORT_NAME_INDEX]}
                            value={food[nutrient2JsonIndex]}
                            key={"1" + index} />
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

};