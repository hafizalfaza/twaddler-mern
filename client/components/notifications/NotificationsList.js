import React from 'react';
import NavigationBar from '../NavigationBar';
import {connect} from 'react-redux';
import Notification from './Notification';
import {fetchNotificationsHistory, setNotificationState, resetUnreadNotifications, changeUnreadNotificationToZero} from '../../actions/notificationActions';


class NotificationsList extends React.Component{
	constructor(props){
		super(props);
	}
	
	componentDidMount(){
		this.props.fetchNotificationsHistory()
		.then((res) => this.props.setNotificationState(res.data))
		.then((res) => this.props.resetUnreadNotifications())
		.then(this.props.changeUnreadNotificationToZero())
		.catch((err) => console.log("error"));
	}	
	
	
	
	render(){
		if (this.props.notifications.notifications) {
			const notifications = this.props.notifications.notifications.map(notification => 
				<Notification key={notification.notificationId} notification={notification} />
			);
			return(
				<div className="container-fluid">
				{notifications}	
				</div>
			);
		}else{
			return null;
		}
	}
}


function mapStateToProps(state){
	return {
		notifications: state.notification
	}
}

export default connect(mapStateToProps, {fetchNotificationsHistory, setNotificationState, resetUnreadNotifications, changeUnreadNotificationToZero})(NotificationsList);