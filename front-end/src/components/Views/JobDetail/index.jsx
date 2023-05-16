import React from 'react';

import { Navigate } from 'react-router-dom';

import AppContext from '@contexts/App';

import ShellNavigation from '@components/Shells/Navigation';

import PartialJobPost from '@components/Partials/JobPost';
import PartialComment from '../../Partials/Comment';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import ErrorCodes from '@shared/ErrorCodes';
import Links from '@shared/Links';
import { Button } from 'reactstrap';

import './index.css';

import ComponentHelpers from '@components/Helpers';

const { withSearchParams } = ComponentHelpers;


const KEY_NUMBER_JOB = AppKeys['NUMBER_JOB']
const KEY_NUMBER_COMMENT = AppKeys['NUMBER_COMMENT']
const KEY_REPLYS = AppKeys['REPLYS']
const KEY_NUMBER_FROM = AppKeys['NUMBER_FROM']




const KEY_SESSION = AppKeys['SESSION'];

const KEY_DESCRIPTION = AppKeys['DESCRIPTION']
const KEY_ERROR_CODE = AppKeys['ERROR_CODE']



const MAP_LINKS = Links['MAP_LINKS'];

class ViewJobDetail extends React.Component {

  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      comment_description: '',
      reply_descriptions: [],
      situation: '',
      job: null,
      votes_all_len:0,
      votes_user_len:0,
      comments:[],//comment : comment_number, description, from_number, from_name , replys
    };

  }

  componentDidMount() {
    this.loadJob();
    this.loadVotes();
    this.loadComments(); //including loading replys
  }

  loadJob () {

    const { props } = this;

    const { searchParams } = props;

    const numberJob = searchParams.get(KEY_NUMBER_JOB);

    const parameters = {
      [KEY_NUMBER_JOB]: numberJob,
    };

    DatabaseDriver.loadJobs(parameters)
      .then((job) => {
        this.setState({ job: job });


      })
      .catch((error) => {


      });

  }

  loadVotes () {

    const { context, props } = this;

    const { searchParams } = props;
    const { user } = context

    const numberJob = searchParams.get(KEY_NUMBER_JOB);
    console.log ( user);

    const parameters = {
      [KEY_NUMBER_JOB]: numberJob,
      [KEY_NUMBER_FROM]: user.number
    };
    console.log ( 'parameters');
    console.log ( parameters)

    DatabaseDriver.loadVotes(parameters)
      .then((votes_data) => {
        console.log ( 'loaded votes_data');
        console.log ( votes_data)
        const { votes_all_len, votes_user_len } = votes_data;
        this.setState ( {votes_all_len:votes_all_len});
        this.setState ( {votes_user_len:votes_user_len});

      })
      .catch((error) => {


      });

  }  

  //load comments including replys
  loadComments () {
    const { props } = this;
    const { searchParams } = props;

    const numberJob = searchParams.get(KEY_NUMBER_JOB);    

    let parameters;

    parameters = {
      [KEY_NUMBER_JOB]: numberJob,
    };


    DatabaseDriver.loadComments(parameters)
      .then((comments) => {
        console.log ( 'Comments');
        console.log ( comments);
        this.setState({ comments: comments });
        let reply_contents = []
        for ( let _ of comments) {
          console.log ( _);
          reply_contents.add('');
        }
        this.setState ( {reply_contents:reply_contents})
      })
      .catch((error) => {


      });

  }

  loadReplys (id) {
    console.log ( 'loading replies');
    const { state } = this;
    const {comments} = state;
    console.log ( id );
    const numberComment = comments[id][KEY_NUMBER_COMMENT]

    let parameters;

    parameters = {
      [KEY_NUMBER_COMMENT]: numberComment,
    };

    console.log ( parameters)

    DatabaseDriver.loadReplys(parameters)
      .then((replys) => {
        console.log ( 'Replys');
        console.log ( id );
        console.log ( replys);
        comments[id][KEY_REPLYS] = replys;
        this.setState({ comments:comments });
      })
      .catch((error) => {


      });

  }  

  saveComment() {
    const { props, context } = this;
    const { searchParams } = props;
    const {comment_description} = this.state;
    const { strings, user } = context;

    const situationFail = strings['MESSAGE_JOBS_FAIL'];
    const situationSuccess = strings['MESSAGE_JOBS_SUCCESS'];

    const number_job = searchParams.get(KEY_NUMBER_JOB);

    let request;
    const { session } = user;
    request = {
      [KEY_SESSION]: session,
      [KEY_NUMBER_JOB]: number_job,
      [KEY_DESCRIPTION]:comment_description,
    };

    const commentFail = () => {
  
      this.setState({ situation: situationFail });
  
    };
  
    const commentSuccess = (response) => {
  
      this.setState({ situation: situationSuccess });
  
      // reload jobs to refresh "all jobs" list
      this.loadComments();
  
    };
    console.log ( 'saving comments here...')
    console.log ( request);
    DatabaseDriver.saveComment(request)
    .then((response) => {

      const errorCode = response[KEY_ERROR_CODE];

      if (errorCode !== ErrorCodes['ERROR_NONE']) {

        commentFail();

      } else {

        commentSuccess(response);

      }

    }).catch((error) => {

      commentFail();

    });

  }

  saveReply(id) {
    const { context, state } = this;
    const {comments,reply_descriptions } = state;
    const { strings, user } = context;

    const situationFail = strings['MESSAGE_JOBS_FAIL'];
    const situationSuccess = strings['MESSAGE_JOBS_SUCCESS'];
    const number_comment = comments[id][KEY_NUMBER_COMMENT]

    console.log ( 'saving reply here...')
    console.log ( comments);
    console.log ( number_comment);
    console.log ( id );
    console.log ( reply_descriptions);

    let request;
    const { session } = user;
    request = {
      [KEY_SESSION]: session,
      [KEY_NUMBER_COMMENT]: number_comment,
      [KEY_DESCRIPTION]:reply_descriptions[id],
    };

    const replyFail = () => {
  
      this.setState({ situation: situationFail });
  
    };
  
    const replySuccess = (response) => {
  
      this.setState({ situation: situationSuccess });
  
      // reload jobs to refresh "all jobs" list
      this.loadReplys(id);
  
    };
    console.log ( request);
    DatabaseDriver.saveReply(request)
    .then((response) => {

      const errorCode = response[KEY_ERROR_CODE];

      if (errorCode !== ErrorCodes['ERROR_NONE']) {

        replyFail();

      } else {

        replySuccess(response);

      }

    }).catch((error) => {

      replyFail();

    });

  }  

  saveVote() {
    const { props, context } = this;
    const { strings, user } = context;
    const { searchParams } = props;
    const situationFail = strings['MESSAGE_JOBS_FAIL'];
    const situationSuccess = strings['MESSAGE_JOBS_SUCCESS'];

    const number_job = searchParams.get(KEY_NUMBER_JOB);

    let request;
    const { session } = user;
    request = {
      [KEY_SESSION]: session,
      [KEY_NUMBER_JOB]: number_job,
    };

    const voteFail = () => {
  
      this.setState({ situation: situationFail });
  
    };
  
    const voteSuccess = (response) => {
  
      this.setState({ situation: situationSuccess });
  
      // reload jobs to refresh "all jobs" list
      this.loadVotes();
  
    };
    DatabaseDriver.saveVote(request)
    .then((response) => {

      const errorCode = response[KEY_ERROR_CODE];

      if (errorCode !== ErrorCodes['ERROR_NONE']) {

        voteFail();

      } else {

        voteSuccess(response);

      }

    }).catch((error) => {

      voteFail();

    });

  }

  render () {

    const { context, state } = this;

    const { user } = context;

    const setValue = (key) => (event) => {
      const element = event.target;
      const value = element.value;
      this.setState({ [key]: value });
  
    };  

    const setReplyValue = (id) => (event) => {
      id = parseInt(id);
      const element = event.target;
      const value = element.value;
      let {reply_descriptions} = state;
      reply_descriptions[id] = value;
      this.setState({ reply_descriptions: reply_descriptions });
  
    };      

    const actionSaveComment = () => {
      console.log ( 'saving comment');
      this.saveComment();

    };

    const actionSaveReply = (id) => {
      id = parseInt(id);
      this.saveReply(id)
    };    

    const actionVote = () => {
      this.saveVote();
    }


    const makeJobElement = (job) => {
      const {context} = this;
      const { user } = context;
      return (<PartialJobPost job={ job } user = {user} page_type = {'detail'}/>);

    };


    const makeCommentElement = (comment, id) => {
      console.log ( id );
      const {
        [KEY_NUMBER_COMMENT]:key,
      } = comment;
      let key_comment = 'comment_' + key
      return (
        <div key = {key_comment}>
          <PartialComment comment={ comment }/>
          <div className = "leave-reply-div">
            <Button color = "success" onClick={ ()=>actionSaveReply(id)}>Reply Above Comment</Button>
            <textarea style = {{width:'100%', border : "1px solid lightskyblue"}} onChange={setReplyValue(id)}></textarea>
          </div>
        </div>
      );
    }
    


    // render for babysitters from the parent
    const renderA = () => {

      const { job, comments, votes_all_len, votes_user_len } = state;
      console.log ( 'vote_all_len');
      console.log ( votes_all_len);
      console.log ( votes_user_len);
      let isDisabled = (votes_user_len  > 0);

      const { strings, user } = context;
      
      const titleJobComments = strings['TITLE_JOB_COMMENTS'];      
      const { type } = user;

      const elementJob = makeJobElement ( job);
      const elementsComment= comments.map(makeCommentElement);


      const body = (
        <div className="ViewJobsDetail">
          {elementJob}
          <div className = "leave-comment-div">
            <div style = {{margin:'10px 2px 10px 2px'}}>
              <Button color = "success" onClick={ actionSaveComment }>Leave New Comment</Button>
              <Button color = {isDisabled ? "secondary":"success"}
                style = {{margin:'0px 10px 0px 10px', color : isDisabled ? 'white':'white'}}
                onClick={ actionVote }
                disabled = {isDisabled}
              >
                Vote
              </Button>
              <span style = {{color:'blue'}}>Voted Number: {votes_all_len}</span>
              <textarea style = {{width:'100%', border:'1px solid lightskyblue'}} onChange={ setValue('comment_description') }></textarea>
            </div>
          </div>
          <div>


            <div className="ViewJobsBabysitter_titleAll">
              <span className="Title_styleA">{ titleJobComments }</span>
            </div>
            <div className="ViewJobsBabysitter_listAll">
              
              { elementsComment }
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

    return renderA();
  }

}

export default withSearchParams(ViewJobDetail);
