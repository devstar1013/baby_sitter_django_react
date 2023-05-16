import React from 'react';

import AppKeys from '@shared/AppKeys';

import './index.css';

import { Link } from 'react-router-dom';

import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle, Col } from 'reactstrap';

const KEY_DESCRIPTION = AppKeys['DESCRIPTION'];
const KEY_TIME_A = AppKeys['TIME_A'];
const KEY_TIME_B = AppKeys['TIME_B'];
const KEY_TITLE = AppKeys['TITLE'];
const KEY_NUMBER_JOB = AppKeys['NUMBER_JOB'];

const KEY_NUMBER_USER = AppKeys['NUMBER_USER'];
const KEY_USERNAME = AppKeys['USERNAME']
const KEY_AGE = AppKeys['AGE']
const KEY_LOCATION = AppKeys['LOC']

const TYPES = {'parent':2, 'babysitter':1};

const SERVER_PROFILE_URL = AppKeys['SERVER_PROFILE_URL']

class PartialJobPost extends React.Component {

  render () {

    const { props } = this;

    const { job, user } = props;
    if ( job === null ) {
      return (<div></div>);
    }

    const {
      [KEY_NUMBER_JOB]: key,
      [KEY_TITLE]: title,
      [KEY_DESCRIPTION]: description,
      [KEY_TIME_A]: timeA,
      [KEY_TIME_B]: timeB,
      [KEY_NUMBER_USER]: number_user,
      [KEY_USERNAME]: username,
      [KEY_AGE]: age,
      [KEY_LOCATION]:location,
    } = job;

    //const dateA = new Date(timeA);
    //const dateB = new Date(timeB);


    //const labelTimeA = dateA.toISOString();
    //const labelTimeB = dateB.toISOString();
    const labelTimeA = timeA;
    const labelTimeB = timeB;

    const applyLink = `/apply?${ KEY_NUMBER_JOB }=${ key }`;
    const detailLink = `/job-detail?${ KEY_NUMBER_JOB }=${ key }`;

    const profileUrl = SERVER_PROFILE_URL + "profile_" + number_user;  

    console.log ( 'page_type');
    console.log ( props.page_type);

    return (
      <Col className = "PartialSitter_singleSitter" key={ key }>
        <Card  color = "success" outline>
        <CardHeader>
          <img src = {profileUrl} className = "avatar" alt="user profile"></img>
          <div style = {{float:'right', textAlign:'center', color:'gray'}}>
            <CardTitle tag = "h4">{ username }</CardTitle>
            <CardSubtitle tag = "h6">{location} | { age } years old</CardSubtitle>
          </div>
          <CardSubtitle tag = "h6" style ={{paddingTop:5}}>Title:</CardSubtitle>
          <CardTitle tag = "h3" style = {{color:'darkblue', marginBottom:0}}>{ title }</CardTitle>
        </CardHeader>
        <CardBody  style = {{height:150}}>
          <CardSubtitle tag = "h6" style ={{paddingTop:5}}>Information:</CardSubtitle>
          <CardTitle tag = "h5" style = {{color:'darkred'}}>{description}</CardTitle>          

        </CardBody>
        <CardFooter style = {{color:'white', backgroundColor:'lightskyblue', textAlign:'right'}}>
          <span style = {{float:'left', paddingRight:20, color:'blue'}}>{labelTimeA}
          </span>
          <span style = {{float:'left', paddingRight:20, color:'black'}}> ~ </span>
          <span style = {{float:'left', color:'yellow'}}>  { labelTimeB }
          </span>
          {
          (job['registration_type'] !== TYPES[user['type']] && (props.page_type === 'job' || props.page_type === 'detail')) ?
          (<Link to={ applyLink } className="Button_navigation">APPLY</Link>):("")
          }
            
          <Link style = {{marginLeft:'20px'}} to={ detailLink } className="Button_navigation">Detail</Link>
        </CardFooter>
      </Card>
      </Col>
    );

  }

}

export default PartialJobPost;