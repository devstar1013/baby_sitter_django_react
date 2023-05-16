import React from 'react';

import { Link} from 'react-router-dom';

import AppContext from '@contexts/App';

import ShellMainGate from '@components/Shells/MainGate';
import ShellNavigation from '@components/Shells/Navigation';

import Links from '@shared/Links';

import './index.css';


const MAP_LINKS = Links['MAP_LINKS'];

class ViewIndex extends React.Component {

  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      slideIndex: 0,
    };

  }
  


  render () {

    const { context } = this;

    const { strings, user } = context;

    // render for when the user is logged in.
    const renderA = () => {

      const { type } = user;

      const {state } = this;
      const { slideIndex } = state;
      let bgs = [
        {id:0, name:'bg0.jpg', imgStyle:'none', dotClass:''},
        {id:1, name:'bg1.jpg', imgStyle:'none', dotClass:''},
        {id:2, name:'bg2.jpg', imgStyle:'none', dotClass:''},
        {id:3, name:'bg3.jpg', imgStyle:'none', dotClass:''},
        {id:4, name:'bg4.jpg', imgStyle:'none', dotClass:''}
      ]
      bgs[slideIndex]['imgStyle'] = 'block';
      bgs[slideIndex]['dotClass'] = 'active';


      const currentSlide =(n)=>{
        this.setState ( {slideIndex:n});
      }        


      const plusSlides = (n) =>{
        let {state} = this;
        let {slideIndex} = state;
        let newIndex = (slideIndex + n + 5) % 5;
        this.setState ( {slideIndex:newIndex});
      }

      const bgMakeElement = (bg) => {
        const key = 'bg_' + bg['name'];
        let imgStyle = bg['imgStyle'];
        
        return (
          <div key = {key}
            style = {{display:imgStyle, alignContent:'center'}}
          >
            <img src={bg['name']} alt = "Child Care Background" style={{width:'100%', borderRadius:'50px'}}></img>
          </div>        
        )
      }
  
      const elementsBg = bgs.map ( bgMakeElement);
      
      const dotMakeElement = (bg) => {
        const key = 'dot_' + bg['name'];

        return (
          <span key = {key} 
            className={bg['dotClass'] + ' dot'} 
            onClick = {()=>currentSlide(bg['id'])}
            style = { {margin:'10px'}}
          >
          </span>
        )
      }
  
      const elementsDot = bgs.map( dotMakeElement)
      
      const body = (
        <div>
          <div className="slideshow-container">
            {elementsBg}
            <a href = "#foo" className="prev" onClick = {() =>plusSlides(-1)}>&#10094;</a>
            <a href = "#foo" className="next" onClick = {() =>plusSlides(1)}>&#10095;</a>
          </div>
          <br></br>

          <div style={{textAlign:'center'}}>
            {elementsDot}
          </div>          
        </div>
      );

      const links = MAP_LINKS[type];

      return (<ShellNavigation body={ body } links={ links }/>);

    };

    // render for when the user is not logged in.
    const renderB = () => {

      const welcome = strings['TITLE_WELCOME'];
      const labelRegister = strings['LABEL_REGISTER'];
      const labelLogIn = strings['LABEL_LOG_IN'];

      const body = (
        <div style = {{marginTop:0}}>
          <h1 style = {{fontSize:30, color:'blue'}}>{ welcome }</h1>          
          <nav className="ViewIndexMainGate_navigation Layout_centralColumn">
            <Link className="Button_navigation" to="/register">{ labelRegister }</Link>
            <Link className="Button_navigation" to="/log-in">{ labelLogIn }</Link>
          </nav>
        </div>
      );

      return (<ShellMainGate body={ body }/>);

    };

    if (user) { // logged-in

      return renderA();

    } else { // not logged-in

      return renderB();

    }

  }

}

export default ViewIndex;
