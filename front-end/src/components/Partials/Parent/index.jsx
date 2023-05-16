import React from 'react';

import AppKeys from '@shared/AppKeys';

import './index.css';

import { Link} from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle, Col} from 'reactstrap';


const KEY_NUMBER_USER = AppKeys['NUMBER_USER'];
const KEY_USERNAME = AppKeys['USERNAME']
const KEY_NUM_OF_CHILDREN = AppKeys['NUM_OF_CHILDREN']
const KEY_SHORT_INFO = AppKeys['SHORT_INFO'];
const KEY_LOC = AppKeys['LOC'];

const SERVER_PROFILE_URL = AppKeys['SERVER_PROFILE_URL'];

class PartialParent extends React.Component {

  render () {
    const { props } = this;
    const { parent } = props;

    const {
      [KEY_NUMBER_USER]: key,
      [KEY_USERNAME]: username,
      [KEY_NUM_OF_CHILDREN]:num_of_children,
      [KEY_SHORT_INFO]:short_info,
      [KEY_LOC]:location,
    } = parent;
    
    const profileUrl = SERVER_PROFILE_URL + "profile_" + key;
    const parentProfileLink = `/parent-profile?${ KEY_NUMBER_USER }=${ key }`;
    const labelProfile = 'Profile';
    return (
      <Col className = "PartialParent_singleParent" key={ key }>
      <Card  color = "success" outline>
        <CardHeader>
          <img src = {profileUrl} className = "avatar" alt = "user profile"></img>
          <div style = {{float:'right', textAlign:'center', color:'gray', paddingRight:20}}>
            <CardTitle tag = "h4">{ username }</CardTitle>
            <CardSubtitle tag = "h6">{location}</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody  style = {{height:150}}>
          <CardSubtitle tag = "h6" style ={{paddingTop:5}}>Information:</CardSubtitle>
          <CardTitle tag = "h5" style = {{color:'darkblue'}}>{short_info}</CardTitle>

        </CardBody>
        <CardFooter style = {{color:'white', backgroundColor:'lightskyblue', textAlign:'right'}}>
          <span style = {{float:'left', paddingRight:20}}> Number Of Children: 
            <span style = {{color:'blue'}}> {num_of_children} </span> 
          </span>
          <Link to={ parentProfileLink } className="Button_navigation">{labelProfile}</Link>
        </CardFooter>
      </Card>
      </Col>        
    );

  }

}

export default PartialParent;