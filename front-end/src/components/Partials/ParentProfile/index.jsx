import React from 'react';

import AppKeys from '@shared/AppKeys';

import './index.css';

import { Link } from 'react-router-dom';

import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle, CardText, Col} from 'reactstrap';

const KEY_NUMBER_USER = AppKeys['NUMBER_USER'];
const KEY_USERNAME = AppKeys['USERNAME'];
const KEY_NUM_OF_CHILDREN = AppKeys['NUM_OF_CHILDREN'];
const KEY_SHORT_INFO = AppKeys['SHORT_INFO'];
const KEY_LOC = AppKeys['LOC'];
const SERVER_PROFILE_URL = AppKeys['SERVER_PROFILE_URL'];

class PartialParentProfile extends React.Component {
  render () {
    const { props } = this;

    const { sitter } = props;
    if ( sitter === null ) {
      return (<div></div>);
    }
    const {
      [KEY_NUMBER_USER]: key,
      [KEY_USERNAME]: username,
      [KEY_NUM_OF_CHILDREN]: num_of_children,
      [KEY_SHORT_INFO]:short_info,
      [KEY_LOC]:loc,
    } = sitter;

    const profileUrl = SERVER_PROFILE_URL + "profile_" + key;
    const parentProfileLink = `/parent-profile?${ KEY_NUMBER_USER }=${ key }`;
    const labelProfile = 'Profile';


    return (
      <Col className = "PartialParent_singleParent" key={ key }>
      <Card  color = "success" outline>
        <CardHeader>
          <img src = {profileUrl} className = "avatar" alt="user-profile"></img>
          <div style = {{float:'right', textAlign:'center', color:'gray', paddingRight:20}}>
            <CardTitle tag = "h4">{ username }</CardTitle>
            <CardSubtitle tag = "h6">{loc}</CardSubtitle>
          </div>
        </CardHeader>
        <CardBody  style = {{height:150}}>
          <CardSubtitle tag = "h5">Information:</CardSubtitle>
          <CardText style = {{paddingLeft:60, color:'gray'}} tag = "h6">
            {short_info}
          </CardText>

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

export default PartialParentProfile;