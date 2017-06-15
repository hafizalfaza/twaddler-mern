import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavigationBar from './NavigationBar';
import FlashMessagesList from './flash/FlashMessagesList';
import Home from './Home';
import LoginPage from './login/LoginPage';
import io from 'socket.io-client';
import { fetchNotificationsHistory, setNotificationState, incrementUnreadNotifications, updateUnreadNotificationsState } from '../actions/notificationActions';
import { setSocketToEstablished } from '../actions/socketActions';

const socket = io('http://localhost:3000');
//  App component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.State = {
      data: {},
    };
    this.sendNotification = this.sendNotification.bind(this);
    this.receiveNotifications = this.receiveNotifications.bind(this);
  }

  componentWillMount() {
    if (this.props.auth.isAuthenticated && !this.props.socketEstablished) {
      socket.emit('new-user', this.props.auth.user.id);
      socket.on('receive-notification', () => {
        this.props.updateUnreadNotificationsState();
      });
      this.props.setSocketToEstablished();
    }
  }

  receiveNotifications() {
    socket.emit('new-user', this.props.auth.user.id);

    this.props.setSocketToEstablished();

    socket.on('receive-notification', () => {
      this.props.updateUnreadNotificationsState();
    });
  }

  sendNotification(notificationData) {
    socket.emit('send-notification', notificationData);
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const guestLinks = (
      <LoginPage receiveNotifications={ this.receiveNotifications }/>
    );

    const userLinks = (
      <Home sendNotification={this.sendNotification}/>
    );
    const navBar = (
      <NavigationBar />
    );

    return (
      <div className="container-fluid">
        <div className="row vertical-center-row">
          { isAuthenticated ? navBar : false }
          <FlashMessagesList />
          { this.props.children }
        </div>
        { isAuthenticated ? userLinks : guestLinks }
      </div>
    );
  }
}


App.propTypes = {
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    socketEstablished: state.socket.socketEstablished,
  };
}

export default connect(mapStateToProps, { fetchNotificationsHistory, setNotificationState, setSocketToEstablished, incrementUnreadNotifications, updateUnreadNotificationsState })(App);
