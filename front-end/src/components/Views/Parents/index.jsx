import React from 'react';

import {Navigate } from 'react-router-dom';

import AppContext from '@contexts/App';

import ShellNavigation from '@components/Shells/Navigation';

import PartialParent from '@components/Partials/Parent';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import Links from '@shared/Links';

import './index.css';

import { Button, Row } from 'reactstrap';

const KEY_NUMBER_USER = AppKeys['NUMBER_USER']
const KEY_REGISTRATION_TYPE  = AppKeys['REGISTRATION_TYPE']

const KEY_CHECK_CHILDREN = AppKeys['CHECK_CHILDREN']
const KEY_NUM_OF_CHILDREN = AppKeys['NUM_OF_CHILDREN']

const MAP_LINKS = Links['MAP_LINKS'];

class ViewParents extends React.Component {


    static contextType = AppContext;

    constructor(props) {
      super(props);
  
      this.state = {
        title: '',
        description: '',
        timeA: 0,
        timeB: 0,
        situation: '',
        parents: [],

        check_children:false,
        num_of_children:1,
      };
  
    }
  
    componentDidMount() {
  
      this.loadParents();
  
    }
  
    loadParents () {
  
      const { context } = this;
  
      const { user } = context;
  
      const { type } = user;
  
      let parameters;
  
      if (type === 'babysitter') {
        parameters = {
          [KEY_REGISTRATION_TYPE]: 2,
        };
  
      }
  
  
      DatabaseDriver.loadUsers(parameters)
        .then((parents) => {
          console.log ( parents);
          this.setState({ parents: parents });
  
        })
        .catch((error) => {
  
  
        });
  
    }

    filterParents() {
      const { state } = this;
      const {check_children, num_Of_children} = state;

      const parameters = {
        [KEY_CHECK_CHILDREN]: check_children,
        [KEY_NUM_OF_CHILDREN]: num_Of_children,
      };
  
      DatabaseDriver.filterParents(parameters)
        .then((parents) => {
          console.log ( parents);
          this.setState({ parents: parents });
        })
        .catch((error) => {
  
  
        });      
    }

  render () {


    const { context, state } = this;

    const { user } = context;

    const renderA = () => {

      const { parents} = state;

      const { strings } = context;

      const titleAllParents = strings['TITLE_ALL_PARENTS'];

      const makeParentElement = (parent) => {

        const {
          [KEY_NUMBER_USER]: key,
        } = parent;

        let parent_key = 'parent_' + key;
        return (
          <div key={ parent_key } className="ViewJobsBabysitter_jobEntry">
            <PartialParent parent={ parent }/>
          </div>
        );

      };

      const actionRefresh = () => {

        this.filterParents();

      };
      const checkToggle = (key) => (event) =>{
        console.log ( key );
        const element = event.target;
        const value = element.checked;
        this.setState ( {[key]:value});
      }

      const selectFilterValue = (key)=> (event) =>{
        const element = event.target;
        const value = element.value;
        console.log ( key, value)
        this.setState ( {[key]:value});
      }

      const elementsParent= parents.map(makeParentElement);
      const {check_children} = state;
      const filterParentDiv = 
        <div className = "filter-parent-div">
          <div>
            <input type="checkbox"
              checked = {check_children}
              onChange = {checkToggle('check_children')}
            />
            <span style = {{color:'blue', width:'250px', display:'inline-block'}}>Number of Children: </span>
            <select onChange={selectFilterValue('num_of_children')}>
              <option value = "1">1</option>
              <option value = "2">2</option>
              <option value = "3">3</option>
              <option value = "4">4</option>
              <option value = "5">5</option>
              <option value = "6">6</option>
              <option value = "7">7</option>
              <option value = "8">8</option>
              <option value = "9">9</option>
              <option value = "10">10</option>
            </select>
          </div>            

          <div style ={{marginLeft:150, marginTop:20}}>
            <Button color = "success" onClick={ actionRefresh }>Search Parents</Button>
          </div> 
        </div>

      const body = (
        <div className="ViewJobsBabysitter">
          <div className="ViewJobsBabysitter_all">
            
            {filterParentDiv}
            <div className="ViewJobsBabysitter_titleAll">
              <span className="Title_styleA">{ titleAllParents }</span>
            </div>
            <Row lg="2" md ="2" sm ="1" xs = "1">
              { elementsParent }
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

      case 'babysitter': {

        return renderA();

      }

      case 'parent': {

        return (<Navigate to="/"/>);

      }

      default:{
        return (<Navigate to="/"/>);
      }

    }

  }

}

export default ViewParents;
