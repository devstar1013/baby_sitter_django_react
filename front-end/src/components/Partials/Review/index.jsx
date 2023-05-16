import React from 'react';

import AppKeys from '@shared/AppKeys';

import './index.css';

import { Card, CardHeader, CardBody,CardTitle, CardSubtitle } from 'reactstrap';

const KEY_RATING = AppKeys['RATING'];
const KEY_DESCRIPTION = AppKeys['DESCRIPTION'];
const KEY_NAME_FROM = AppKeys['NAME_FROM'];
const KEY_NUMBER_FROM = AppKeys['NUMBER_FROM'];

const SERVER_PROFILE_URL = AppKeys['SERVER_PROFILE_URL']

class PartialReview extends React.Component {

  render () {

    const { props } = this;

    const { review } = props;


    const {
      [KEY_NUMBER_FROM]:number_from,
      [KEY_RATING]: rating,
      [KEY_NAME_FROM]: name_from,
      [KEY_DESCRIPTION]:description
    } = review;
    
    const profileUrl = SERVER_PROFILE_URL + "profile_" + number_from;
    let starRating = 'Rating: ';
    for ( var i = 0; i < rating; i++) starRating += '⭐';
    return (
      <div style = {{width:'100%', border:'1px solid black'}}>
        <div className = "PartialSitter_singleSitter">
          <Card  color = "success" outline>
            <CardHeader>
              <img src = {profileUrl} className = "review-avatar" alt="user-profile"></img>
              <div style = {{float:'right', textAlign:'center', color:'gray'}}>
                <span>left by</span>
                <CardTitle tag = "h4">{name_from}</CardTitle>
              </div>
              <p style = {{color:'darkblue', paddingTop:5}}>
                <span style = {{color:'blue'}}> { starRating }</span>
              </p>
            </CardHeader>
            <CardBody  style = {{height:120}}>
              <CardSubtitle tag = "h6" style ={{paddingTop:5}}>Review:</CardSubtitle>
              <CardTitle tag = "h5" style = {{color:'darkgreen'}}>{description}</CardTitle>
            </CardBody>
          </Card>
      </div>        
      </div>
    );
  };        
}

export default PartialReview;