import React from 'react';
import LoginForm from './LoginForm';
import { Link } from 'react-router-dom';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reloaded: false,
    };
  }

  render() {
    return (
      <div className='row' style={ { position: 'relative', top: 150 } }>
        <div className='col-md-4 col-md-offset-4'>
          <LoginForm receiveNotifications={ this.props.receiveNotifications }/>
          <span>Dont have an account?</span> <Link to='/signup'> Sign up</Link>
        </div>
      </div>
    );
  }
}

export default LoginPage;
