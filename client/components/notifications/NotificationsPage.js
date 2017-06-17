import React from 'react';
import NavigationBar from '../NavigationBar';
import NotificationsList from './NotificationsList';
import { connect } from 'react-redux';
import { resetUnreadNotifications } from '../../actions/notificationActions';

class NotificationsPage extends React.Component {
  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <NavigationBar pathname={this.props.location.pathname}/>
        </div>
        <div className='col-md-5 col-md-offset-3'>
          <NotificationsList />
        </div>
      </div>
    );
  }
}

export default connect(null, { resetUnreadNotifications })(NotificationsPage);
