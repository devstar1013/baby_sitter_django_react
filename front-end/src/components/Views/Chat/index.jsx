import React from 'react';

import { Navigate } from 'react-router-dom';

import AppContext from '@contexts/App';

import ShellNavigation from '@components/Shells/Navigation';
import ComponentHelpers from '@components/Helpers';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import ErrorCodes from '@shared/ErrorCodes';
import Links from '@shared/Links';

import  {Button, Input, InputGroup, InputGroupText, Card, CardHeader, CardBody, CardTitle, CardSubtitle} from 'reactstrap';

import './index.css';

const { withSearchParams } = ComponentHelpers;

const KEY_APPLICATION = AppKeys['APPLICATION'];
const KEY_CONTENTS = AppKeys['CONTENTS'];
const KEY_ERROR_CODE = AppKeys['ERROR_CODE'];
const KEY_MESSAGES = AppKeys['MESSAGES'];
const KEY_NUMBER_APPLICATION = AppKeys['NUMBER_APPLICATION'];
const KEY_NUMBER_AUTHOR = AppKeys['NUMBER_AUTHOR'];
const KEY_NUMBER_CHAT = AppKeys['NUMBER_CHAT'];
const KEY_TITLE = AppKeys['TITLE'];
const KEY_NUMBER_FROM = AppKeys['NUMBER_FROM'];
const KEY_UESRNAME = AppKeys['USERNAME'];
const MAP_LINKS = Links['MAP_LINKS'];
const SERVER_PROFILE_URL = AppKeys['SERVER_PROFILE_URL'];

class ViewChat extends React.Component {

  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      situation: '',
      contents: '',
      applications: [],
      chat: null,
    };

  }

  componentDidMount() {

    this.loadChat();

  }

  loadChat () {

    const { props } = this;

    const { searchParams } = props;

    const numberApplication = searchParams.get(KEY_APPLICATION);

    const parameters = {
      [KEY_NUMBER_APPLICATION]: numberApplication,
    };

    DatabaseDriver.loadChat(parameters)
      .then((chat) => {

        this.setState({ chat: chat });

      })
      .catch((error) => {


      });

  }

  render () {

    const { context, state } = this;

    const { user } = context;

    const { chat, situation } = state;

    if (!chat) {

      return null;

    }

    // render for both parents and babysitters
    const renderCommon = () => {

      const { chat, contents } = state;

      const { strings, user } = context;

      // show nothing while chat is not loaded
      if (!chat) {

        return null;

      }

      const { number: numberUser, type } = user;

      const setValue = (key) => (event) => {

        const element = event.target;
        const value = element.value;
        this.setState({ [key]: value });
  
      };

      const {
        [KEY_NUMBER_CHAT]: numberChat,
        [KEY_TITLE]: title,
        [KEY_MESSAGES]: messages,
        [KEY_NUMBER_FROM]:chat_app_id,
        [KEY_UESRNAME]: chat_app_username,
      } = chat;

      const makeMessageElement = (message, id) => {
        const {
          [KEY_NUMBER_AUTHOR]: numberAuthor,
          [KEY_CONTENTS]: contents,
        } = message;

        let className;

        if (numberAuthor === numberUser) {

          className = "ViewChat_messageAuthor";

        } else {

          className = "ViewChat_messageOther";

        }
        let app_key = 'application_' + id;
        const msgProfileUrl = SERVER_PROFILE_URL + "profile_" + numberAuthor;
        return (
          <div className={ className } key = {app_key}>
            <img src = {msgProfileUrl} className = "msg-avatar" alt="user profile"></img>
            <span>{ contents }</span>
          </div>
        );

      };

      const actionRefresh = () => {

        this.loadChat();

      };

      const actionSendMessage = () => {

        const situationFail = strings['SEND_MESSAGE_FAIL'];
        const situationSuccess = strings['SEND_MESSAGE_SUCCESS'];
        const situationTry = strings['SEND_MESSAGE_TRY'];

        const sendFail = () => {
  
          this.setState({ situation: situationFail });
  
        };
  
        const sendSuccess = () => {
  
          this.setState({ situation: situationSuccess });

          // refreshes the chat screen
          this.loadChat();
  
        };

        const sendTry = () => {

          const parameters = {
            [KEY_NUMBER_CHAT]: numberChat,
            [KEY_NUMBER_AUTHOR]: numberUser,
            [KEY_CONTENTS]: contents,
          };
  
          DatabaseDriver.saveMessage(parameters)
            .then((response) => {
  
              const errorCode = response[KEY_ERROR_CODE];
  
              if (errorCode !== ErrorCodes['ERROR_NONE']) {
  
                sendFail();
  
              } else {
  
                sendSuccess();
  
              }
  
            }).catch((error) => {
  
              sendFail();
  
            });
  
        };
  
        this.setState({ situation: situationTry }, sendTry);

      };
      

      const elementMessages = messages.map(makeMessageElement);
      const chatProfileUrl = SERVER_PROFILE_URL + "profile_" + chat_app_id;
      const body = (
        <div className="ViewChat">
          <Button color = "success" onClick={ actionRefresh }>REFRESH</Button>
          <div className="ViewChat_container">
            <Card>
              <CardHeader>
              <img src = {chatProfileUrl} className = "avatar" alt="usr profile"></img>
              <div style = {{float:'right', textAlign:'center', color:'gray'}}>
              <CardSubtitle tag = "h6">Created By</CardSubtitle>
              <CardTitle tag = "h4">{ chat_app_username }</CardTitle>
          </div>
          <CardSubtitle tag = "h6" style ={{paddingTop:5}}>Job Title:</CardSubtitle>
          <CardTitle tag = "h3" style = {{color:'darkblue', marginBottom:0}}>{ title }</CardTitle>              
              </CardHeader>
              <CardBody style = {{height:550}}>
                <div className="ViewChat_messages">
                { elementMessages }
                </div>
                <div className="ViewChat_messageBox">
                <InputGroup>
                  <InputGroupText>Message</InputGroupText>
                  <Input onChange={ setValue('contents') }></Input>
                  <Button color = "success" onClick={ actionSendMessage }>SEND</Button>
                </InputGroup>
                <div className="ViewChat_messageSituation">{ situation }</div>
                </div>
              </CardBody>
            </Card>
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

    return renderCommon();

  }

}

export default withSearchParams(ViewChat);
