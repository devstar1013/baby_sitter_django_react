import React from 'react';
import PropTypes from 'prop-types';

import AppContext from '@contexts/App';

import './index.css';

import AppKeys from '@shared/AppKeys';
import { Navbar, NavbarBrand, Nav, NavLink } from 'reactstrap';


const SERVER_PROFILE_URL = AppKeys['SERVER_PROFILE_URL'];


class ShellNavigation extends React.Component {

  static contextType = AppContext;

  render () {


    const { props, context } = this;

    const { body, links } = props;

    const { strings, user } = context;

    const profileUrl = SERVER_PROFILE_URL + "profile_" + user['number'];

    //const appTitle = strings['TITLE_APP'];
    const navigationLinks = links.map((pair) => {

      const { key, link } = pair;

      const label = strings[key];

      return (
        <NavLink key={ key } href={ link } style = {{color:'white'}}>{ label }</NavLink>
      );

    });

    return (
      <>
      <Navbar color = "success" dark style = {{height:70,paddingRight:50}} className="icare-navbar">
        <NavbarBrand href = "/" style = {{marginTop:0, paddingTop:0}}>
          <img alt = "iCare" src = "logo.png" style = {{width:60, height:50, borderRadius:10}}/>
          <span style = {{paddingLeft:20, fontSize:30}}>iCare</span>
        </NavbarBrand>
        <Nav className = "mr-auto">
          { navigationLinks }
          <img src = {profileUrl} className = "profile-avatar" alt = "user profile"></img>
        </Nav>
      </Navbar>
      <div className="ShellNavigation_body">{ body }</div>
      </>
    );

  }

}

ShellNavigation.propTypes = {
  body: PropTypes.element.isRequired,
  links: PropTypes.array,
};

export default ShellNavigation;
