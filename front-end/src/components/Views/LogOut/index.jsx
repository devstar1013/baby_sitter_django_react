import React from 'react';

class ViewLogOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  
  render () {
      sessionStorage.clear();
      window.location.href = "/log-in";
      return(<div></div>);
  }
}
export default ViewLogOut;
