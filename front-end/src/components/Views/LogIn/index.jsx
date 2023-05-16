import React from 'react';

import AppContext from '@contexts/App';

import ShellMainGate  from '@components/Shells/MainGate';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import ErrorCodes from '@shared/ErrorCodes';

import './index.css';

import { Button, InputGroup, Input, InputGroupText } from 'reactstrap';

const KEY_ERROR_CODE = AppKeys['ERROR_CODE'];
const KEY_FIRST_NAME = AppKeys['FIRST_NAME'];
const KEY_LAST_NAME = AppKeys['LAST_NAME'];
const KEY_NUMBER_USER = AppKeys['NUMBER_USER'];
const KEY_REGISTRATION_TYPE = AppKeys['REGISTRATION_TYPE'];
const KEY_PASSWORD = AppKeys['PASSWORD'];
const KEY_USERNAME = AppKeys['USERNAME'];
const KEY_SESSION = AppKeys['SESSION'];

const TIMEOUT_LOG_IN = 2400; // milliseconds

class ViewLogIn extends React.Component {

  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      situation: '',
    };

  }

  render () {

    const { context, state } = this;

    const { strings, user, app } = context;

    // render for when the user is not logged in.
    const renderB = () => {

      const { username, password, situation } = state;

      const setValue = (key) => (event) => {

      const element = event.target;
        const value = element.value;
        this.setState({ [key]: value });
  
      };

      const situationFail = strings['MESSAGE_LOG_IN_FAIL'];
      const situationSuccess = strings['MESSAGE_LOG_IN_SUCCESS'];
      const situationTry = strings['MESSAGE_LOG_IN_TRY'];

      const labelLogIn = strings['LABEL_LOG_IN'];
      const labelPassword = strings['LABEL_PASSWORD'];
      const labelUsername = strings['LABEL_USERNAME'];

      const titleLogIn = strings['TITLE_LOG_IN'];

      const actionSubmit = () => {
  
        const request = {
          [KEY_PASSWORD]: password,
          [KEY_USERNAME]: username,
        };

        const loadUser = (response) => () => {

          const session = response[KEY_SESSION];
          const firstName = response[KEY_FIRST_NAME];
          const lastName = response[KEY_LAST_NAME];
          const number = response[KEY_NUMBER_USER];
          const type = response[KEY_REGISTRATION_TYPE];

          const user = { session, firstName, lastName, number, type };
          sessionStorage.setItem ( 'user', JSON.stringify(user));

          app.setState({ user: user });

        };
  
        const logInFail = () => {
  
          this.setState({ situation: situationFail });
  
        };
  
        const logInSuccess = (response) => {
  
          this.setState({ situation: situationSuccess });

          setTimeout(loadUser(response), TIMEOUT_LOG_IN);
  
        };
  
        const logInTry = () => {
          console.log ( 'trying log in');
          DatabaseDriver.logInUser(request)
            .then((response) => {
              console.log ( 'response');
              console.log ( response);
              const errorCode = response[KEY_ERROR_CODE];
  
              if (errorCode !== ErrorCodes['ERROR_NONE']) {
  
                logInFail();
  
              } else {
  
                logInSuccess(response);
  
              }
  
            }).catch((error) => {
  
              logInFail();
  
            });
  
        };
  
        this.setState({ situation: situationTry }, logInTry);
  
      };

      const body = (
        <div className="ViewLogInMainGate">
          <div className="ViewLogInMainGate_title">
            <span className="Title_styleA">{ titleLogIn }</span>
          </div>
          <div className="Layout_labeledInput" style = {{paddingTop:20}}>
            <InputGroup>
                <InputGroupText>{ labelUsername }</InputGroupText>
                <Input type="text" onChange={ setValue('username') }></Input>
            </InputGroup>            
          </div>
          <div className="Layout_labeledInput" style = {{paddingTop:20}}>
            <InputGroup>
                <InputGroupText>{ labelPassword }</InputGroupText>
                <Input type="password" onChange={ setValue('password') }></Input>
            </InputGroup>
          </div>
          <Button color = "success" style = {{marginLeft:130}} onClick={ actionSubmit }>{ labelLogIn }</Button>
          <div className="Layout_alwaysFilled">{ situation }</div>
        </div>
      );

      return (<ShellMainGate body={ body }/>);
      

    };

    if (user) { // logged-in

      //return renderA();
      window.location.href = "/";

    } else { // not logged-in
      return renderB();

    }

  }

}

export default ViewLogIn;
