import React from 'react';

import AppKeys from '@shared/AppKeys';

import './index.css';

import {Col} from 'reactstrap';

import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle} from 'reactstrap';

import { Link } from 'react-router-dom';

const KEY_NUMBER_USER = AppKeys['NUMBER_USER'];
const KEY_USERNAME = AppKeys['USERNAME']
const KEY_AGE = AppKeys['AGE']
const KEY_EDUCATION = AppKeys['EDUCATION']
const KEY_EXP_YEARS = AppKeys['EXP_YEARS']
const KEY_GENDER = AppKeys['GENDER']
const KEY_CHILD_CARE = AppKeys['CHILD_CARE']
const KEY_SCHOOL_HELP = AppKeys['SCHOOL_HELP']
const KEY_SHORT_INFO = AppKeys['SHORT_INFO']

const SERVER_PROFILE_URL = AppKeys['SERVER_PROFILE_URL']

class PartialSitter extends React.Component {

  render () {
    const genderName = ['Male', 'Female'];
    const { props} = this;

    const { sitter } = props;
    

    const {
      [KEY_NUMBER_USER]: key,
      [KEY_USERNAME]: username,
      [KEY_AGE]: age,
      [KEY_EDUCATION]: education,
      [KEY_EXP_YEARS]:exp_years,
      [KEY_GENDER]:gender,
      [KEY_CHILD_CARE]:child_care,
      [KEY_SCHOOL_HELP]:school_help,
      [KEY_SHORT_INFO]:short_info,
    } = sitter;
    const child_care_str = child_care ? 'Child Care' :'';
    const school_help_str = school_help ? 'School Help':'';
    const sitterProfileLink = `/sitter-profile?${ KEY_NUMBER_USER }=${ key }`;
    const profileUrl = SERVER_PROFILE_URL + "profile_" + key;
    
    return (
      <Col className = "PartialSitter_singleSitter" key={ key }>
      <Card  color = "success" outline>
        <CardHeader>
          <img src = {profileUrl} className = "avatar" alt = "profile user"></img>
          <div style = {{float:'right', textAlign:'center', color:'gray'}}>
            <CardTitle tag = "h4">{ username }</CardTitle>
            <CardSubtitle tag = "h6">{ age } years old</CardSubtitle>
          </div>
          <div style = {{color:'darkblue'}}>Experience: 
            <span style = {{color:'blue'}}> { exp_years } Years</span>
          </div>
          <div style = {{color:'darkblue'}}>Educatin: 
            <span style = {{color:'blue'}}> { education }</span>
          </div>
        </CardHeader>
        <CardBody  style = {{height:150}}>
          <CardSubtitle tag = "h6" style ={{paddingTop:5}}>Information:</CardSubtitle>
          <CardTitle tag = "h5" style = {{color:'darkgreen'}}>{short_info}</CardTitle>          

        </CardBody>
        <CardFooter style = {{color:'white', backgroundColor:'lightskyblue', textAlign:'right'}}>
          <span style = {{float:'left', paddingRight:20}}> Skill: 
            <span style = {{color:'blue'}}> {child_care_str} </span>  
            <span style = {{color:'red'}}> {school_help_str} </span>
          </span>
          <span style = {{float:'left'}}> Gender: 
            <span style = {{color:'yellow'}}> { genderName[gender] } </span>
          </span>
          <Link to={ sitterProfileLink } className="Button_navigation">Profile</Link>
        </CardFooter>
      </Card>
      </Col>
    );

  }

}

export default PartialSitter;