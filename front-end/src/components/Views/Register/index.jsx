import React from 'react';

import AppContext from '@contexts/App';

import ShellMainGate from '@components/Shells/MainGate';

import DatabaseDriver from '@database/Driver';

import AppKeys from '@shared/AppKeys';
import ErrorCodes from '@shared/ErrorCodes';

import {Button, ButtonGroup, Row, Col } from 'reactstrap';

import './index.css';

const KEY_EMAIL = AppKeys['EMAIL'];
const KEY_ERROR_CODE = AppKeys['ERROR_CODE'];
const KEY_FIRST_NAME = AppKeys['FIRST_NAME'];
const KEY_LAST_NAME = AppKeys['LAST_NAME'];
const KEY_PASSWORD = AppKeys['PASSWORD'];
const KEY_USERNAME = AppKeys['USERNAME'];
const KEY_REGISTRATION_TYPE = AppKeys['REGISTRATION_TYPE'];
const KEY_LOC = AppKeys['LOC'];
const KEY_DESCRIPTION = AppKeys['DESCRIPTION'];
const KEY_AGE = AppKeys['AGE'];
const KEY_GENDER = AppKeys['GENDER'];
const KEY_EDUCATION = AppKeys['EDUCATION'];
const KEY_EXP_YEARS = AppKeys['EXP_YEARS'];
const KEY_SKILL = AppKeys['SKILL'];
const KEY_NUM_OF_CHILDREN = AppKeys['NUM_OF_CHILDREN'];

class ViewRegister extends React.Component {

  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      imgSrc:null,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      situation: '',
      username: '',
      type: 'babysitter',

      loc:'',
      short_info:'',
      age:0,
      gender:0,
      education:'',
      exp_years:0,
      skill:0,

      num_of_children:0,

      errorMsg:'',
    };
    this.selectedFile = React.createRef(null);
  }

  render () {

    const { context, state } = this;

    const { strings } = context;

    const { situation } = state;

    const labelBabysitter = strings['LABEL_BABYSITTER'];
    const labelEmail = strings['LABEL_EMAIL']
    const labelFirstName = strings['LABEL_FIRST_NAME'];
    const labelLastName = strings['LABEL_LAST_NAME'];
    const labelParent = strings['LABEL_PARENT'];
    const labelPassword = strings['LABEL_PASSWORD'];
    const labelRegister = strings['LABEL_REGISTER'];
    const labelUsername = strings['LABEL_USERNAME'];
    const labelLoc = strings['LABEL_LOC'];
    const labelShortInfo = strings['LABEL_SHORT_INFO'];
    const labelAge = strings['LABEL_AGE'];
    const labelGender = strings['LABEL_GENDER'];
    const labelEducation = strings['LABEL_EDUCATION'];
    const labelExpYears = strings['LABEL_EXP_YEARS'];
    const labelSkills = strings['LABEL_SKILLS'];
    const labelNumOfChildren = strings['LABEL_NUM_OF_CHILDREN'];

    const titleRegister = strings['TITLE_REGISTER'];
    

    const situationFail = strings['MESSAGE_REGISTRATION_FAIL'];
    const situationSuccess = strings['MESSAGE_REGISTRATION_SUCCESS'];
    const situationTry = strings['MESSAGE_REGISTRATION_TRY'];

    const genderValue = {'male':0, 'female':1};
    const skillValue = {'child_care':0, 'school_help':1};
    const setValue = (key) => (event) => {

      const element = event.target;
      const value = element.value;
      if ( key === 'gender') {
        this.setState( {[key]: genderValue[value]});
      }
      else if ( key === 'skill') {
        this.setState ( {[key]: skillValue[value]});
      }
      else {
        this.setState({ [key]: value });
      }
    };

    const setType = (type) => () => {

      this.setState({ type: type });

    };

    const actionSubmit = () => {

      let { email,imgSrc, firstName, lastName, username, password, type, loc, short_info, age, gender, education, exp_years, skill, num_of_children } = state;
      this.setState ( {errorMsg:''});
      if ( imgSrc == null ) {
        this.setState ( {errorMsg:'Profile Image Required'});
        return;        
      }
      if ( firstName === '') {
        this.setState ( {errorMsg:'First Name Required'});
        return;        
      }
      if ( lastName === '') {
        this.setState ( {errorMsg:'Last Name Required'});
        return;        
      }
      if ( username === '') {
        this.setState ( {errorMsg:'Username Required'});
        return;        
      }

      if ( email === '') {
        this.setState ( {errorMsg:'Email Required'});
        return;        
      }
      if ( email.includes('@') === false) {
        this.setState ( {errorMsg:'Email Missing @'});
        return;        
      }
      if ( password.length < 6) {
        this.setState ( {errorMsg:'Password should be over 6 letters'});
        return;        
      }
      if ( loc === '') {
        this.setState ( {errorMsg:'Location Required'});
        return;        
      }            
      if ( short_info === '') {
        this.setState ( {errorMsg:'Information Required'});
        return;        
      }
      if ( type ==='babysitter') {
        let age_num = Number ( age );
        if ( age_num === Infinity || String(age_num) !== age) {
          this.setState ( {errorMsg:'Age should be number'});
          return;
        }

        if ( age_num < 19) {
          this.setState ( {errorMsg:'Age should be older than 19'});
          return;                
        }

        if ( education === '') {
          this.setState ( {errorMsg:'Education Required'});
          return;        
        }

        let years_num = Number ( exp_years );
        if ( years_num === Infinity || String(years_num) !== exp_years) {
          this.setState ( {errorMsg:'Years should be number'});
          return;
        }

        if ( exp_years === 0) {
          this.setState ( {errorMsg:'Years should over than 0'});
        }
        num_of_children = 0;
      }
      else {
        age = 0;
        education = '';
        exp_years= 0;
        
        let num_of_children_num = Number(num_of_children);
        if ( num_of_children_num === Infinity || String(num_of_children_num) !== num_of_children) {
          this.setState ( {errorMsg:'Children number should be number)'});
          return;
        }
        if ( num_of_children === 0) {
          this.setState ( {errorMsg:'Children number should be over than 1'});
        }
      }


      const request = {
        [KEY_EMAIL]: email,
        [KEY_FIRST_NAME]: firstName,
        [KEY_LAST_NAME]: lastName,
        [KEY_PASSWORD]: password,
        [KEY_USERNAME]: username,
        [KEY_REGISTRATION_TYPE]: type,
        [KEY_LOC]: loc,
        [KEY_DESCRIPTION]: short_info,
        [KEY_AGE]: age,
        [KEY_GENDER]: gender,
        [KEY_EDUCATION]: education,
        [KEY_EXP_YEARS]: exp_years,
        [KEY_SKILL]: skill,
        [KEY_NUM_OF_CHILDREN]: num_of_children,
      };

      const registrationFail = () => {

        this.setState({ situation: situationFail });

      };

      const registrationSuccess = () => {

        this.setState({ situation: situationSuccess });
        // user profile save
        
        window.location.href = '/';

      };

      const registrationTry = () => {
        console.log ( "registering...");
        DatabaseDriver.registerUser(request, this.selectedFile.current.files[0])
          .then((response) => {

            const errorCode = response[KEY_ERROR_CODE];
            
            if (errorCode !== ErrorCodes['ERROR_NONE']) {

              registrationFail();

            } else {

              registrationSuccess();

            }

          }).catch((error) => {

            registrationFail();

          });

      };

      this.setState({ situation: situationTry }, registrationTry);

    };
    const {shortInfoError, ageError, educationError, expYearsError, childrenNumError} = state;
    const sitterBody = (
      <>
      <div>
        <div>
          <div className="Layout_inputLabel">
            <span> {labelShortInfo} </span>
            <span style = {{color:'red'}}> { shortInfoError }</span>
          </div>
          <div className="Layout_inputField">
            <textarea style = {{width:'100%'}} onChange={ setValue('short_info') }/>
          </div>
        </div>
        <div>
          <div className="Layout_inputLabel">
            <span> {labelEducation} </span>
            <span style = {{color:'red'}}> { educationError }</span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}} type="text" onChange={ setValue('education') }/>
          </div>
        </div>
      </div>

      <Row lg = "2" md = "2" sm = "1" xs = "1">
        <div>
          <div className="Layout_inputLabel">
            <span> {labelAge} </span>
            <span style = {{color:'red'}}> { ageError }</span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}}  type="text"  onChange={ setValue('age') }/>
          </div>
        </div>

        <div>
          <div className="Layout_inputLabel">
            <span> {labelGender} </span>
          </div>
            <select style = {{width:'100%'}} onChange = {setValue('gender')}>
              <option value ="male">Male</option>
              <option value = "female">Female</option>
            </select>
        </div>
        <div>
          <div className="Layout_inputLabel">
            <span> {labelSkills} </span>
          </div>
          <div className="Layout_inputField">
            <select style = {{width:'100%'}} onChange = {setValue('skill')}>
              <option value ="child_care">Child Care</option>
              <option value = "school_help">School Help</option>
            </select>
          </div>
        </div>
        <div>
          <div className="Layout_inputLabel">
            <span> {labelExpYears} </span>
            <span style = {{color:'red'}}> { expYearsError }</span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}} type="text" onChange={ setValue('exp_years') }/>
          </div>
        </div>        
      </Row>
      <div >
          <Button style = {{marginTop:10, marginLeft:120, width:100}} color = "success" onClick={ actionSubmit }>{ labelRegister }</Button>
      </div>
      <div className="Layout_alwaysFilled">{ situation }</div>
      </>
    );

    const parentBody = (
      <div>
        <div>
          <div>
            <div className="Layout_inputLabel">
              <span> {labelShortInfo} </span>
              <span style = {{color:'red'}}> { shortInfoError }</span>
            </div>
            <div className="Layout_inputField">
              <textarea style = {{width:'100%'}} onChange={ setValue('short_info') }/>
            </div>
          </div>

          <div className="Layout_inputLabel">
            <span> {labelNumOfChildren} </span>
            <span style = {{color:'red'}}> { childrenNumError }</span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}} type="text" onChange={ setValue('num_of_children') }/>
          </div>
        </div>        
        <Button style = {{marginTop:10, marginLeft:120}} color="success" onClick={ actionSubmit }>{ labelRegister }</Button>
        <div className="Layout_alwaysFilled">{ situation }</div>
      </div>
    );

    const {type, errorMsg} = state;

    const onImgChange =() =>{
      // Assuming only image
      var file = this.selectedFile.current.files[0];
      if ( file == null ) return;
      var reader = new FileReader();
      var url = reader.readAsDataURL(file);
    
       reader.onloadend = function (e) {
          this.setState({
              imgSrc: [reader.result]
          })
        }.bind(this);
      console.log(url) // Would see a path?
    }
    const fileUpload = () => {
      console.log ( this.selectedFile);
      this.selectedFile.current.click();
    }
    const commonBody = (
      <>
      <Col className="ViewRegisterMainGate_title">
        <span className="Title_styleA">{ titleRegister }</span>
      </Col>
      <Col className="ViewRegisterMainGate_title">
        <span className="Title_styleA">{type}</span>
      </Col>        
      <div>
        <span style = {{color:'red'}}> { errorMsg }</span>
      </div>
      <ButtonGroup style = {{width:'100%'}}>
        <Button color = "primary" onClick={ setType('babysitter')} active = {type === 'babysitter'}>{ labelBabysitter }</Button>
        <Button color = "primary" onClick={ setType('parent') } active = {type === 'parent'}>{labelParent}</Button>
      </ButtonGroup>
      <div 
        style = {{marginLeft:70, marginTop:30, width:210, height:210}}
        onClick = {fileUpload}
      >
        <form>
          <input 
            hidden
            ref={this.selectedFile} 
            type="file" 
            name="user[image]" 
            onChange={onImgChange}/>
        </form>
        <span style = {{marginLeft:20}}>Select Profile Image</span>
        <img src={this.state.imgSrc} style = {{width:180, height:180}} alt=""/>
      </div>
      <Row lg = "2" md = "2" sm = "1" xs = "1">
        <Col>
          <div className="Layout_inputLabel">
            <span>{ labelFirstName }</span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}} type="text" onChange={ setValue('firstName') } required/>
          </div>
        </Col>
        <Col>
          <div className="Layout_inputLabel">
            <span>{ labelLastName }</span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}} type="text" onChange={ setValue('lastName') } />
          </div>
        </Col>
        <Col>
          <div className="Layout_inputLabel">
            <span>{ labelUsername }</span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}} type="text" onChange={ setValue('username') } />
          </div>
        </Col>
        <Col>
          <div className="Layout_inputLabel">
            <span>{ labelEmail }</span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}} type="text" onChange={ setValue('email') }/>
          </div>
        </Col>
        <Col>
          <div className="Layout_inputLabel">
            <span>{ labelPassword }</span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}} type="password" onChange={ setValue('password') }/>
          </div>
        </Col>
        <div>
          <div className="Layout_inputLabel">
            <span> {labelLoc} </span>
          </div>
          <div className="Layout_inputField">
            <input style = {{width:'100%'}}  type="text" onChange={ setValue('loc') }/>
          </div>
        </div>        
      </Row>
      </>
    );

    if ( type ==='babysitter') {
      const body = (
        <div className="ViewRegisterMainGate">
          {commonBody}
          {sitterBody}
          <img src="sitter.png" alt = "sitter" style = {{width:300, height:300, marginLeft:400, marginTop:-500}}></img>
        </div>
      )
      return (<ShellMainGate body={ body }/>);
    }
    const body = (
      <div className="ViewRegisterMainGate">
        {commonBody}
        {parentBody}
        <img src="parents.png" alt = "sitter" style = {{width:300, height:300, marginLeft:400, marginTop:-500}}></img>
      </div>
    )    
    return (<ShellMainGate body={ body }/>);
  }

}

export default ViewRegister;