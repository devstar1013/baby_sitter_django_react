import React from 'react';

import { Navigate } from 'react-router-dom';

import AppContext from '@contexts/App';

import ShellNavigation from '@components/Shells/Navigation';

import PartialSitterProfile from '@components/Partials/SitterProfile';
import PartialJobPost from '@components/Partials/JobPost';
import PartialReview from '@components/Partials/Review';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import ErrorCodes from '@shared/ErrorCodes';
import Links from '@shared/Links';
import { Button } from 'reactstrap';

import './index.css';


import ComponentHelpers from '@components/Helpers';

const { withSearchParams } = ComponentHelpers;


const KEY_NUMBER_USER = AppKeys['NUMBER_USER']
const KEY_NUMBER_TO = AppKeys['NUMBER_TO']
const KEY_NUMBER_PARENT = AppKeys['NUMBER_PARENT']
const KEY_NUMBER_FRIEND = AppKeys['NUMBER_FRIEND']
const KEY_NUMBER_JOB = AppKeys['NUMBER_JOB'];

const KEY_NUMBER_REVIEW = AppKeys['NUMBER_REVIEW']

const KEY_SESSION = AppKeys['SESSION'];

const KEY_RATING = AppKeys['RATING']
const KEY_DESCRIPTION = AppKeys['DESCRIPTION']
const KEY_ERROR_CODE = AppKeys['ERROR_CODE']


const MAP_LINKS = Links['MAP_LINKS'];

class ViewSitterProfile extends React.Component {

  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      rating:1,
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
        this.setState({ reviews: reviews });
        this.setState ({startPage:0});
        this.setState ({curPage:0});
        let nPage = parseInt((reviews.length + 4)/5);
        if ( nPage === 0 ) nPage = 1;
        this.setState ( {nPage:nPage});
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
        this.setState({ jobs: jobs });

      })
      .catch((error) => {


      });

  }  

  saveReview() {
    const { props, context } = this;
    const { searchParams } = props;
    const {description, rating} = this.state;
    const { strings, user } = context;

    const situationSuccess = strings['MESSAGE_JOBS_SUCCESS'];

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
        this.setState({ reviewStatus: 'You have already left review to this sitter' });
      }
  
    };
  
    const reviewSuccess = (response) => {
  
      this.setState({ situation: situationSuccess });
  
      // reload jobs to refresh "all jobs" list
      this.setState({ reviewStatus: 'You have successfully left review to the sitter' });
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

    const actionAddWatchList = () => {
      const { props, context } = this;
      const { searchParams } = props;
      const { strings, user } = context;
  
      const situationFail = strings['MESSAGE_JOBS_FAIL'];
      const situationSuccess = strings['MESSAGE_JOBS_SUCCESS'];
  
      const number_friend = searchParams.get(KEY_NUMBER_USER);
  
      let request;
      const { session } = user;
      request = {
        [KEY_SESSION]: session,
        [KEY_NUMBER_FRIEND]: number_friend,
      };
  
      const watchFail = () => {
    
        this.setState({ situation: situationFail });
    
      };
    
      const watchSuccess = (response) => {
        console.log ( response);
    
        this.setState({ situation: situationSuccess });
   
      };
      console.log ( request);
      DatabaseDriver.saveWatch(request)
      .then((response) => {
  
        const errorCode = response[KEY_ERROR_CODE];
  
        if (errorCode !== ErrorCodes['ERROR_NONE']) {
  
          watchFail();
  
        } else {
  
          watchSuccess(response);
  
        }
  
      }).catch((error) => {
  
        watchFail();
  
      });
    }


    const makeJobElement = (job) => {
      const {[KEY_NUMBER_JOB]: key} = job;
      const key_job = 'job_' + key;      
      const {context} = this;
      const {user} = context;
      return (<PartialJobPost key = {key_job} job={ job } user = {user} page_type = {'profile'}/>);

    };

    const makeReviewElement = (review) => {
      const {[KEY_NUMBER_REVIEW]:key} = review;
      const key_review = 'review_' + key;
      return (<PartialReview key = {key_review} review={ review }/>);
    }

    const makePageElement = (page) => {
      let key_page = 'page_' + page['number'];
      if ( page['number'] === page['current']) {
        return (<a 
          href="#foo"
          key = {key_page}
          className = 'active' 
          onClick = {()=>currentPage(page['number'])}>
          {page['number'] + 1}
        </a>);
      }
      else {
        return (<a 
          href = "#foo"
          key = {key_page} onClick = {()=>currentPage(page['number'])}>
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


      const titleSitterReviews = strings['TITLE_SITTER_REVIEWS'];
      const titleSitterJobs = strings['TITLE_SITTER_JOBS'];
      
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

          <div className="ViewJobsBabysitter_all">
            {<PartialSitterProfile sitter={ sitter } actionAddWatchList = {actionAddWatchList}/>}
            <div className = "leave-review-div">
              <Button color = "primary" onClick={ actionSaveReview }>Leave Review</Button>
              <span style = {{color:'blue', paddingLeft:'30px'}}>Rating: </span>
              <select style = {{width:'100px', marginRight:'20px'}} onChange={ setValue('rating') }>
                <option value = "1" >1</option>
                <option value = "2">2</option>
                <option value = "3">3</option>
                <option value = "4">4</option>
                <option value = "5">5</option>
              </select>
              <span style = {{color:'red'}}>{reviewStatus}</span>
              <textarea style = {{width:'100%', border:'1px solid lightskyblue'}} onChange={ setValue('description') }></textarea>
            </div>         

            <div className="ViewJobsBabysitter_titleAll">
              <span className="Title_styleA">{ titleSitterReviews }</span>
            </div>
            <div className="ViewJobsBabysitter_listAll">
              
              { elementsReview }
            </div>
            <div className="pagination" style = {{float:'right'}}>
              <a href = "#foo" onClick = {()=>addPage(-1)}>&laquo;</a>
              <span>
                {elementsPage}
              </span>
              <a href = "#foo" onClick = {()=>addPage(1)}>&raquo;</a>
              <span style = {{color:'white'}}>!</span>
            </div>



            <div className="ViewJobsBabysitter_listAll">
            <div className="ViewJobsBabysitter_titleAll" style = {{width:'100%'}}>
              <p>
              <span className="Title_styleA">{ titleSitterJobs }</span>
              </p>
            </div>              
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

      case 'parent': {

        return renderA();

      }

      case 'babysitter': {

        return (<Navigate to="/"/>);

      }

      default:{
        return (<Navigate to="/"/>);
      }

    }

  }

}

export default withSearchParams(ViewSitterProfile);
