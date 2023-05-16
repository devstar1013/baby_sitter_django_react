import React from 'react';

import {Navigate } from 'react-router-dom';

import AppContext from '@contexts/App';

import ShellNavigation from '@components/Shells/Navigation';

import PartialSitter from '@components/Partials/Sitter';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import Links from '@shared/Links';

import { Row, Button } from 'reactstrap';
import './index.css';

const KEY_NUMBER_USER = AppKeys['NUMBER_USER']
const KEY_REGISTRATION_TYPE  = AppKeys['REGISTRATION_TYPE']

const KEY_CHECK_AGE = AppKeys['CHECK_AGE']
const KEY_CHECK_GENDER = AppKeys['CHECK_GENDER']
const KEY_CHECK_SKILL = AppKeys['CHECK_SKILL']
const KEY_MIN_AGE = AppKeys['MIN_AGE']
const KEY_MAX_AGE = AppKeys['MAX_AGE']
const KEY_GENDER = AppKeys['GENDER']
const KEY_SKILL = AppKeys['SKILL']

const MAP_LINKS = Links['MAP_LINKS'];

class ViewSitters extends React.Component {


    static contextType = AppContext;

    constructor(props) {
      super(props);
  
      this.state = {
        title: '',
        description: '',
        timeA: 0,
        timeB: 0,
        situation: '',
        sitters: [],

        checkAge:false,
        minAge:0,
        maxAge:0,

        checkGender:false,
        gender:0,

        checkSkill:false,
        skill:0

      };
  
    }
  
    componentDidMount() {
  
      this.loadSitters();
  
    }
  
    loadSitters () {
  
      const { context } = this;
  
      const { user } = context;
  
      const { type } = user;
  
      let parameters;
  
      if (type === 'parent') {
  
        parameters = {
          [KEY_REGISTRATION_TYPE]: 1,
        };
  
      }
      DatabaseDriver.loadUsers(parameters)
        .then((sitters) => {
          console.log ( sitters);
          this.setState({ sitters: sitters });
  
        })
        .catch((error) => {
  
  
        });
  
    }

    filterSitters() {
      const { state } = this;
      const {checkAge, checkGender, checkSkill, minAge, maxAge, gender, skill} = state;

      const parameters = {
        [KEY_CHECK_AGE]: checkAge,
        [KEY_CHECK_GENDER]:checkGender,
        [KEY_CHECK_SKILL]: checkSkill,
        [KEY_MIN_AGE]: minAge,
        [KEY_MAX_AGE]:maxAge,
        [KEY_GENDER]:gender,
        [KEY_SKILL]:skill
      };

      DatabaseDriver.filterSitters(parameters)
        .then((sitters) => {
          console.log ( sitters);
          this.setState({ sitters: sitters });
        })
        .catch((error) => {
  
  
        });      
    }

  render () {

    const { context, state } = this;

    const { user } = context;


    // render for babysitters
    const renderA = () => {

      const { sitters, minAge, maxAge } = state;

      const { strings } = context;

      const titleAllSitters = strings['TITLE_ALL_SITTERS'];

      const makeSitterElement = (sitter) => {

        const {
          [KEY_NUMBER_USER]: key,
        } = sitter;
        let sitter_key = 'sitter_' + key;
        return (
          <div key={ sitter_key }>
            <PartialSitter sitter={ sitter }/>
          </div>
        );

      };

      const actionRefresh = () => {

        this.filterSitters();

      };
      const checkToggle = (key) => (event) =>{
        console.log ( key );
        const element = event.target;
        const value = element.checked;
        this.setState ( {[key]:value});
      }

      const changeFilterValue = (key)=> (event)=>{
        const element = event.target;
        const value = element.value;
        this.setState ( {[key]:value});
      }
      const selectFilterValue = (key)=> (event) =>{
        const element = event.target;
        const value = element.value;
        const keyValue = {'male':0, 'female':1, 'child_care':0, 'school_help':1};
        this.setState ( {[key]:keyValue[value]});
      }

      const elementsSitter= sitters.map(makeSitterElement);
      const {checkAge, checkGender, checkSkill} = state;
      const filterSitterDiv = 
        <div className = "filter-sitter-div">
          <div className = "filter-sitter-row">
            <input type="checkbox"
              checked = {checkAge}
              onChange = {checkToggle('checkAge')}
            />
            <span style = {{color:'blue', width:'120px', display:'inline-block'}}>Age Range: </span>
            <span> Min Age</span>
            <input type = "text" value = {minAge} style = {{width:100}} onChange = {changeFilterValue('minAge')}/>
            <span> ~Max Age</span>
            <input type = "text" value = {maxAge} style = {{width:100}} onChange = {changeFilterValue('maxAge')}/>
          </div>
          <div className = "filter-sitter-row">
            <input type="checkbox"
              checked = {checkGender}
              onChange = {checkToggle('checkGender')}
            />
            <span style = {{color:'blue', width:'120px', display:'inline-block'}}>Gender: </span>
            <select onChange = {selectFilterValue('gender')}>
              <option value = "male">Male</option>
              <option value = "female">Female</option>
            </select>
          </div>
          <div className = "filter-sitter-row">
            <input type="checkbox"
              checked = {checkSkill}
              onChange = {checkToggle('checkSkill')}
            />
            <span style = {{color:'blue', width:'120px', display:'inline-block'}}>Skills: </span>
            <select onChange={selectFilterValue('skill')}>
              <option value = "child_care">Child Care</option>
              <option value = "school_help">School Help</option>
            </select>
          </div>            

          <div style ={{marginLeft:250}}>
            <Button color = "primary" onClick={ actionRefresh }>Search Sitter</Button>
          </div> 
        </div>

      const body = (
        <div className="ViewJobsBabysitter">
          <div className="ViewJobsBabysitter_all">
            
            {filterSitterDiv}
            <div className="ViewJobsBabysitter_titleAll">
              <span className="Title_styleA">{ titleAllSitters }</span>
            </div>
            <Row lg = "2" md = "2" sm = "1" xs = "1">
              { elementsSitter }
            </Row>
          </div>
        </div>
      );


      const links = MAP_LINKS[type];

      return (<ShellNavigation body={ body } links={ links }/>);

    };

    // render redirection if the user is not logged in
    if (!user) {

      return (<Navigate to="/"/>);

    }

    const { type } = user;

    switch (type) {

      case 'parent': {

        return renderA();

      }

      case 'babysitter': {

        return (<Navigate to="/"/>);

      }

      default:{
        return (<Navigate to="/"/>);
      }

    }

  }

}

export default ViewSitters;
