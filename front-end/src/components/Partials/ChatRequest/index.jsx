import React from 'react';
import AppKeys from '@shared/AppKeys';
import './index.css';
import { Card, CardHeader,CardTitle, CardSubtitle, CardBody, Button } from 'reactstrap';
import {Link} from 'react-router-dom';

const KEY_USER_NAME = AppKeys['USERNAME'];
const KEY_COVER_LETTER = AppKeys['COVER_LETTER'];
const KEY_NUMBER_CHAT = AppKeys['NUMBER_CHAT'];
const KEY_FROM_NUMBER = AppKeys['NUMBER_FROM'];
const KEY_NUMBER_APPLICATION = AppKeys['NUMBER_APPLICATION'];
const SERVER_PROFILE_URL = AppKeys['SERVER_PROFILE_URL'];
const KEY_LOC = AppKeys['LOC'];


class PartialChatRequest extends React.Component {

  render () {

    const { props } = this;

    const { application } = props;

    const {
      [KEY_NUMBER_APPLICATION]: numberApplication,
      [KEY_FROM_NUMBER]: number_from,
      [KEY_USER_NAME]: username,
      [KEY_COVER_LETTER]: coverLetter,
      [KEY_LOC]:location,      
      [KEY_NUMBER_CHAT]: numberChat,
    } = application;
    
    const profileUrl = SERVER_PROFILE_URL + "profile_" + number_from;
    let chatLink = null;

    if (numberChat || props.job_type === 'posted') {

      const link = `/chat?application=${ numberApplication }`;
      chatLink = (<Link to={ link } className="Button_navigation">CHAT</Link>);

    } else {

      chatLink = (<Button color = "secondary">NO CHAT YET</Button>);

    }     
    return (
      <Card color = "success" outline>
        <CardHeader>
          <img src = {profileUrl} className = "avatar" alt = "user profile"></img>
          <div style = {{float:'right', textAlign:'center', color:'gray', paddingRight:20}}>
            <CardTitle tag = "h4">{ username }</CardTitle>
            <CardSubtitle tag = "h6">{location}</CardSubtitle>
          </div>
          <div style = {{paddingTop:10}}>
            { chatLink }
          </div>
        </CardHeader>        
        <CardBody>
          <CardSubtitle tag = "h6" style ={{paddingTop:5}}>Cover Letter:</CardSubtitle>
          <CardTitle tag = "h5" style = {{color:'darkred'}}>{ coverLetter }</CardTitle>
        </CardBody>
      </Card>
    );


  }

}

export default PartialChatRequest;