import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SignupForm from './SignupForm';
import { userSignupRequest, doesUserExist } from '../../actions/signupActions';
import { addFlashMessage } from '../../actions/flashMessages';
import NavigationBar from '../NavigationBar';

class SignupPage extends React.Component {
  render() {
    const { userSignupRequest, addFlashMessage, doesUserExist } = this.props;
    return (
      <div className='container-fluid'>
        <div className='row'>
          <nav className='navbar navbar-inverse navbar-static-top' role='navigation'>
            <div className='container-fluid'>
              <div className='navbar-header'>
                <Link to='/' className='navbar-brand'>Twatter</Link>
              </div>
            </div>
          </nav>
        </div>

        <div className='row'>
          <div className='col-md-4 col-md-offset-4'>
            <SignupForm
              userSignupRequest={ userSignupRequest }
              addFlashMessage={ addFlashMessage }
              doesUserExist={ doesUserExist }
            />
             Already have an account? <Link to='/'>Log in</Link>
          </div>
        </div>
      </div>
    );
  }
}

SignupPage.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  doesUserExist: PropTypes.func.isRequired,
};

export default connect(null, { userSignupRequest, addFlashMessage, doesUserExist })(SignupPage);
