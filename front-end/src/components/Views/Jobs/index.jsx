import React from 'react';

import {Navigate } from 'react-router-dom';

import AppContext from '@contexts/App';

import ShellNavigation from '@components/Shells/Navigation';

import PartialJobPost from '@components/Partials/JobPost';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import Links from '@shared/Links';

import './index.css';

import {Button, Row} from 'reactstrap';

const KEY_NUMBER_JOB = AppKeys['NUMBER_JOB'];
const KEY_CHECK_FAMILY = AppKeys['CHECK_FAMILY'];
const KEY_CHECK_SITTER = AppKeys['CHECK_SITTER'];

const MAP_LINKS = Links['MAP_LINKS'];



class ViewJobs extends React.Component {

  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      checkFamily:true,
      checkSitter:true
    };

  }

  componentDidMount() {

    this.loadJobs();

  }

  loadJobs () {

    DatabaseDriver.loadJobs()
      .then((jobs) => {

        this.setState({ jobs: jobs });

      })
      .catch((error) => {


      });

  }

  filterJobs() {
    const { state } = this;
    const {checkFamily, checkSitter} = state;

    const parameters = {
      [KEY_CHECK_FAMILY]: checkFamily,
      [KEY_CHECK_SITTER]:checkSitter,
    };

    DatabaseDriver.filterJobs(parameters)
      .then((jobs) => {
        this.setState({ jobs: jobs });
      })
      .catch((error) => {


      });      
  }  

  render () {

    const { context, state } = this;

    const { strings, user } = context;
    
    const {checkFamily, checkSitter} = state;
    
    const actionFilter = () => {
      this.filterJobs();
    }

    const changeCheckValue = ( key) => ( event) => {
      const element = event.target;
      const value = element.checked;
      this.setState ( {[key]: value});
    }

    const filterJobDiv = 
    <div className = "filter-job-div">
      <div className = "filter-job-row">
        <input type="checkbox"
          checked={checkFamily}
          onChange = { changeCheckValue('checkFamily')}
        />
        <span style = {{color:'blue', display:'inline-block'}}> Jobs Created By Familiy/Parents </span>
      </div>
      <div className = "filter-job-row">
        <input type="checkbox"
         checked = { checkSitter}
         onChange = { changeCheckValue('checkSitter')}
        />
        <span style = {{color:'blue', display:'inline-block'}}> Jobs Created By Babby Sitter/Nannies </span>
      </div>            
      <div style ={{marginLeft:250}}>
            <Button color = "primary" onClick={ actionFilter }>Search Job</Button>
      </div>       
    </div>    
    // render for parents
    const renderA = () => {

      const {jobs } = state;
      const {context} = this;
      const {user} = context;


      const titleJobsAll = strings['TITLE_JOBS_ALL'];
      

      const makeJobElement = (job) => {
        const {
          [KEY_NUMBER_JOB]: key,
        } = job;

        const key_job = 'job_' + key;
        return (
          <div  key={ key_job } className="ViewJobsBabysitter_jobEntry">
            <PartialJobPost job={ job } user={user} page_type = {'job'}/>
          </div>
        
        );

      };
     const elementsJob = jobs.map(makeJobElement);

      const body = (
        <div className="ViewJobsParent">
          <div className="ViewJobsParent_all">
            {filterJobDiv}
            <div className="ViewJobsParent_titleAll">
              <span className="Title_styleA">{ titleJobsAll }</span>
            </div>
            <Row lg = "2" md = "2" sm = "1" xs = "1">
              { elementsJob }
            </Row>
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
    return renderA();

  }

}

export default ViewJobs;
