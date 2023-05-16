import React from 'react';

import { Navigate } from 'react-router-dom';

import AppContext from '@contexts/App';

import ShellNavigation from '@components/Shells/Navigation';

import PartialParentProfile from '@components/Partials/ParentProfile';
import PartialJobPost from '@components/Partials/JobPost';
import PartialReview from '@components/Partials/Review';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import ErrorCodes from '@shared/ErrorCodes';
import Links from '@shared/Links';

import './index.css';

import ComponentHelpers from '@components/Helpers';

import { Button } from 'reactstrap';

const { withSearchParams } = ComponentHelpers;


const KEY_NUMBER_USER = AppKeys['NUMBER_USER']
const KEY_NUMBER_TO = AppKeys['NUMBER_TO']
const KEY_NUMBER_PARENT = AppKeys['NUMBER_PARENT']
const KEY_NUMBER_JOB = AppKeys['NUMBER_JOB'];

const KEY_NUMBER_REVIEW = AppKeys['NUMBER_REVIEW']

const KEY_SESSION = AppKeys['SESSION'];

const KEY_RATING = AppKeys['RATING']
const KEY_DESCRIPTION = AppKeys['DESCRIPTION']
const KEY_ERROR_CODE = AppKeys['ERROR_CODE']


const MAP_LINKS = Links['MAP_LINKS'];

class ViewParentProfile extends React.Component {

  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      rating:0,
      situation: '',
      sitter: null,
      reviews:[],
      jobs:[],
      reviewStatus:'',
      startPage:0,
      curPage:0,
      nPage:1      
    };

  }

  componentDidMount() {
    this.loadSitter();
    this.loadReviews();
    this.loadJobs();
  }

  loadSitter () {

    const { props } = this;

    const { searchParams } = props;

    const numberUser = searchParams.get(KEY_NUMBER_USER);

    const parameters = {
      [KEY_NUMBER_USER]: numberUser,
    };

    DatabaseDriver.loadUsers(parameters)
      .then((sitter) => {
        console.log ( 'sitter');
        console.log ( sitter);
        this.setState({ sitter: sitter });

      })
      .catch((error) => {


      });

  }  

  loadReviews () {
    const { props } = this;
    const { searchParams } = props;

    const numberUser = searchParams.get(KEY_NUMBER_USER);    

    let parameters;

    parameters = {
      [KEY_NUMBER_TO]: numberUser,
    };


    DatabaseDriver.loadReviews(parameters)
      .then((reviews) => {
        console.log ( 'Reviews');
        console.log ( reviews);
        this.setState({ reviews: reviews });

      })
      .catch((error) => {


      });

  }
  loadJobs () {
    const { props } = this;
    const { searchParams } = props;

    const numberUser = searchParams.get(KEY_NUMBER_USER);    

    let parameters;

    parameters = {
      [KEY_NUMBER_PARENT]: numberUser,
    };


    DatabaseDriver.loadJobs(parameters)
      .then((jobs) => {
        console.log ( 'Jobs');
        console.log ( jobs);
        this.setState({ jobs: jobs });

      })
      .catch((error) => {


      });

  }  

  saveReview() {
    const { props, context } = this;
    const { searchParams } = props;
    const {description, rating} = this.state;
    const { user } = context;

    const number_to = searchParams.get(KEY_NUMBER_USER);

    let request;
    const { session } = user;
    request = {
      [KEY_SESSION]: session,
      [KEY_NUMBER_TO]: number_to,
      [KEY_DESCRIPTION]:description,
      [KEY_RATING]:rating
    };

    const reviewFail = (errorCode) => {
      if ( errorCode === ErrorCodes['ERROR_GENERIC']) {
        this.setState({ reviewStatus: 'You have failed to leave review owing to network problem' });
      }
      else {
        this.setState({ reviewStatus: 'You have already left review to the parents' });
      }  
    };
  
    const reviewSuccess = (response) => {
  
      this.setState({ reviewStatus: 'You have successfully left review to the parents' });
  
      // reload jobs to refresh "all jobs" list
      this.loadReviews();
  
    };
    console.log ( 'saving...')
    console.log ( request);
    DatabaseDriver.saveReview(request)
    .then((response) => {

      const errorCode = response[KEY_ERROR_CODE];

      if (errorCode !== ErrorCodes['ERROR_NONE']) {

        reviewFail(errorCode);

      } else {

        reviewSuccess(response);

      }

    }).catch((error) => {

      reviewFail(ErrorCodes['ERROR_GENERIC']);

    });

  }


  render () {

    const { context, state } = this;

    const { user } = context;

    const setValue = (key) => (event) => {

      const element = event.target;
      const value = element.value;
      console.log ( value);
      this.setState({ [key]: value });
  
    };  

    const actionSaveReview = () => {

      this.saveReview();

    };



    const makeJobElement = (job) => {
      const {[KEY_NUMBER_JOB]: key} = job;
      const key_job = 'job_' + key;
      return (<PartialJobPost key = {key_job} job={ job} user = {user} page_type = {'profile'}/>);

    };

    const makeReviewElement = (review) => {
      const {[KEY_NUMBER_REVIEW]:key} = review;
      const key_review = 'review_' + key;
      return (<PartialReview key = {key_review} review={ review }/>);
    }

    const makePageElement = (page) => {
      let key_page = 'page_' + page['number'];
      if ( page['number'] === page['current']) {
        return (<a key = {key_page} 
          href = "#foo"
          className = 'active' 
          onClick = {()=>currentPage(page['number'])}>
          {page['number'] + 1}
        </a>);
      }
      else {
        return (<a key = {key_page} 
          href = "#foo"
          onClick = {()=>currentPage(page['number'])}>
          {page['number'] + 1}
        </a>);
      }

    } 

    const addPage = (n)=>{
      let { startPage, curPage, nPage} = state;
      curPage += n;
      if (curPage < 0 ) {
        curPage = 0;
      }
      if ( curPage >= nPage ) {
        curPage = nPage - 1;
      }
      if ( curPage < startPage ) {
        startPage = curPage;
      }
      if ( curPage > startPage + 4) {
        startPage = curPage - 4;
      }
      this.setState ({startPage:startPage});
      this.setState ({curPage:curPage});
    }

    const currentPage = (curPage)=> {
      let { startPage, nPage} = state;
      if (curPage < 0 ) {
        curPage = 0;
      }
      if ( curPage >= nPage ) {
        curPage = nPage - 1;
      }
      if ( curPage < startPage ) {
        startPage = curPage;
      }
      if ( curPage > startPage + 4) {
        startPage = curPage - 4;
      }
      this.setState ({startPage:startPage});
      this.setState ({curPage:curPage});      
    }    

    // render for babysitters from the parent
    const renderA = () => {

      const { reviews, sitter, jobs, reviewStatus, startPage, curPage, nPage } = state;

      const { strings } = context;


      const titleParentReviews = strings['TITLE_PARENT_REVIEWS'];
      const titleParentJobs = strings['TITLE_PARENT_JOBS'];
      
      let pageReviews = [];
      let startReview = curPage*5;
      let endReview = startReview + 5;
      if ( endReview > reviews.length) {
        endReview = reviews.length;
      }
      for ( let i = startReview; i < endReview; i++) {
        pageReviews.push ( reviews[i]);
      }
      const elementsReview= pageReviews.map(makeReviewElement);


      let endPage = startPage + 5;
      if ( endPage >= nPage ) endPage = nPage;
      let pages = []
      for ( let i = startPage; i < endPage; i++) {
        pages.push ( {'number':i, 'current':curPage});
      }
      let elementsPage = pages.map ( makePageElement);

      const elementsJob = jobs.map(makeJobElement);

      
      const body = (
        <div className="ViewParentProfile">
            {<PartialParentProfile sitter={ sitter }/>}
            <div className = "leave-review-div">
              <Button color = "primary" onClick={ actionSaveReview }>Leave Review</Button>
              <span style = {{color:'blue', paddingLeft:'30px'}}>Rating: </span>
              <select style = {{width:'100px'}} onChange={ setValue('rating') }>
                <option value = "1" >1</option>
                <option value = "2">2</option>
                <option value = "3">3</option>
                <option value = "4">4</option>
                <option value = "5">5</option>
              </select>
              <span style = {{color:'red'}}>{reviewStatus}</span>
              <textarea style = {{width:'100%', border:'1px lightskyblue solid'}} onChange={ setValue('description') }></textarea>
            </div>         

            <div className="ViewJobsBabysitter_titleAll">
              <span className="Title_styleA">{ titleParentReviews }</span>
            </div>
            <div className="ViewJobsBabysitter_listAll">
              
              { elementsReview }
            </div>
          <div>
            <div className="pagination" style = {{float:'right'}}>
              <a href = "#foo" onClick = {()=>addPage(-1)}>&laquo;</a>
              <span>
                {elementsPage}
              </span>
              <a href = "#foo" onClick = {()=>addPage(1)}>&raquo;</a>
              <span style = {{color:'white'}}>!</span>
            </div>

            <div style = {{paddingTop:30}}>
              <span className="Title_styleA">{ titleParentJobs }</span>
            </div>
            <div className="ViewJobsBabysitter_listAll">
              { elementsJob }
            </div>            
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

    switch (type) {

      case 'babysitter': {

        return renderA();

      }

      case 'parent': {

        return (<Navigate to="/"/>);

      }

      default:{
        return (<Navigate to="/"/>);
      }

    }

  }

}

export default withSearchParams(ViewParentProfile);
