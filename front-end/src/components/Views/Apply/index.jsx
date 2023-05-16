import React from 'react';

import { Navigate } from 'react-router-dom';

import AppContext from '@contexts/App';

import ShellNavigation from '@components/Shells/Navigation';
import PartialJobPost from '@components/Partials/JobPost';
import ComponentHelpers from '@components/Helpers';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import ErrorCodes from '@shared/ErrorCodes';
import Links from '@shared/Links';

import './index.css';

import { Card, CardBody, CardHeader, CardFooter, Button} from 'reactstrap';

const { withSearchParams } = ComponentHelpers;

const KEY_COVER_LETTER = AppKeys['COVER_LETTER'];
const KEY_ERROR_CODE = AppKeys['ERROR_CODE'];
const KEY_NUMBER_JOB = AppKeys['NUMBER_JOB'];
const KEY_NUMBER_USER = AppKeys['NUMBER_USER'];

const MAP_LINKS = Links['MAP_LINKS'];

class ViewApply extends React.Component {

  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      job: null,
      situation: '',
      coverLetter: '',
    };

  }

  componentDidMount() {

    const { context } = this;

    const { user } = context;

    if (user) {

      this.loadJob();

    }

  }

  loadJob () {

    const {props } = this;

    const { searchParams } = props;

    const key = searchParams.get(KEY_NUMBER_JOB);

    if (!key) {

      return;

    }

    const parameters = {
      [KEY_NUMBER_JOB]: key,
    };

    DatabaseDriver.loadJobs(parameters)
      .then((job) => {

        this.setState({ job: job });

      })
      .catch((error) => {


      });

  }

  render () {

    const { context, state } = this;

    const { strings, user } = context;

    const { job, situation } = state;

    // render for babysitters
    const renderB = () => {

      // the job is not loaded yet, show nothing
      if (!job) {

        return null;

      }

      const situationFail = strings['MESSAGE_APPLY_FAIL'];
      const situationSuccess = strings['MESSAGE_APPLY_SUCCESS'];
      const situationTry = strings['MESSAGE_APPLY_TRY'];

      const actionSubmit = () => {

        const { coverLetter } = state;

        const { number: numberUser } = user;

        const { [KEY_NUMBER_JOB]: numberJob } = job;
  
        const request = {
          [KEY_NUMBER_USER]: numberUser,
          [KEY_NUMBER_JOB]: numberJob,
          [KEY_COVER_LETTER]: coverLetter,
        };
  
        const applyFail = (errorCode) => {
          if ( errorCode === ErrorCodes['ERROR_GENERIC']) {
            this.setState({ situation: situationFail });
          }
          else {
            this.setState({ situation: 'Failed ( You have already applied to this job.)' });
          }
          
  
        };
  
        const applySuccess = () => {
  
          this.setState({ situation: situationSuccess });
  
        };
  
        const applyTry = () => {
  
          DatabaseDriver.applyUser(request)
            .then((response) => {
  
              const errorCode = response[KEY_ERROR_CODE];
  
              if (errorCode !== ErrorCodes['ERROR_NONE']) {
  
                applyFail(errorCode);
  
              } else {
  
                applySuccess();
  
              }
  
            }).catch((error) => {
  
              applyFail();
  
            });
  
        };
  
        this.setState({ situation: situationTry }, applyTry);
  
      };

      const setValue = (key) => (event) => {

        const element = event.target;
        const value = element.value;
        this.setState({ [key]: value });
  
      };
      

      const { user } = context;
      const body = (
        <div className="ViewApplyBabysitter">
          <div style = {{width:'80%', marginLeft:'auto', marginRight:'auto'}}>
            <PartialJobPost job={ job } user = {user} page_type = {'apply'}/>
          </div>
          <div style = {{width:'80%', marginLeft:'auto', marginRight:'auto'}}>
            <Card color="primary" outline className="application-letter">
              <CardHeader>
                <h3>APPLICATION</h3>
              </CardHeader>
              <CardBody style = {{margin:0, padding:0}}>
                <textarea onChange={ setValue('coverLetter') } 
                  rows={ 3 } cols={ 60 } style = {{width:'100%', height:'100%', border:"None"}}
                >
                </textarea>
              </CardBody>
              <CardFooter>
              <span>{ situation }</span>
              <Button color = "success" onClick={ actionSubmit } style = {{float:'right'}}>SUBMIT</Button>
              </CardFooter>
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

    const { type } = user;
    return renderB();
  }

}

export default withSearchParams(ViewApply);
