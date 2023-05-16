import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import AppContext from '@contexts/App';

import './index.css';


// This is the shell for users that are not logged-in.
// Because they are not logged-in, they're outside at the main gate.
class ShellMainGate extends React.Component {

  static contextType = AppContext;

  render () {

    const { props} = this;

    const { body } = props;

    return (
      <div className="ShellMainGate">
        <div className="ShellMainGate_head">
            <Link className="ShellMainGate_headTitle" to="/">
              <img alt = "iCare" src = "logo.png" style = {{width:200, height:150}}/>
            </Link>            
        </div>
        <div className="ShellMainGate_body">{ body }</div>
      </div>
    );

  }

}

ShellMainGate.propTypes = {
  body: PropTypes.element.isRequired
};

export default ShellMainGate;
