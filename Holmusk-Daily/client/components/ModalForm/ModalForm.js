import React, { Component } from 'react';

import { POST_FOOD_ENDPOINT } from '../../constants/ApiEndpoints';

/*
* ModalForm container, containing a form for user to submit a new food, make a POST request
*/

export default class ModalForm extends Component {

  constructor(props) {
    super(props);

    this.clearForm = this.clearForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.exitModal = this.exitModal.bind(this);
    this.checkNotNull = this.checkNotNull.bind(this);
  }

  clearForm() {
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
  }

  handleSubmit(e) {

    e.preventDefault();

    let title = this.refs.title.value;
    let calories = this.refs.calories.value;
    let totalCarbs = this.refs.carb.value;
    let protein = this.refs.protein.value;
    let totalFat = this.refs.fat.value;
    let sugars = this.refs.sugars.value;
    let dietaryFiber = this.refs.fibre.value;
    let sodium = this.refs.sodium.value;
    let potassium = this.refs.potassium.value;
    let iron = this.refs.iron.value;
    let calcium = this.refs.calcium.value;
    let vitaminA = this.refs.vitamin_a.value;
    let vitaminC = this.refs.vitamin_c.value;
    let saturated = this.refs.saturated.value;
    let trans = this.refs.trans.value;
    let polyunsaturated = this.refs.poly_unsat.value;
    let monounsaturated = this.refs.mono_unsat.value;

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

    const postJson = {
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
      data: postJson
    })
      .done(data => {
        console.log("success post " + data.title);
        alert("Your food has been submitted to Holmusk Daily. Thank you for your submission!");
      })
      .fail((xhr, status, err) => {
        console.error(this.props.urlPost, status, err.toString());
      });

    this.exitModal();
  }

  componentDidMount() {
    $('.modal-trigger').leanModal();
  }

  exitModal(e) {
    this.clearForm();
    $('#modal-newfood').closeModal();
  }

  checkNotNull(val) {
    return val && val !== undefined && val !== null && val !== '';
  }

  render() {
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
};