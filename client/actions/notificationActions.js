import axios from 'axios';
import {SET_NOTIFICATION_STATE, UPDATE_UNREAD_NOTIFICATIONS, RESET_UNREAD_NOTIFICATION} from './types';

//Fetch notifications history action
export function fetchNotificationsHistory(data){
	return dispatch => {
		return axios.get('/api/users/notifications')
	}
}


//Store notifications to redux
export function setNotificationState(notifications){
	return {
		type: SET_NOTIFICATION_STATE,
		notifications
	}
}

//Reset unread notification in database
export function resetUnreadNotifications(){
	return dispatch => {
		return axios.post('/api/users/notifications/reset-unread')
	}
}

//Reset unread notifications in redux store
export function changeUnreadNotificationToZero(){
	return {
		type: RESET_UNREAD_NOTIFICATION
	}
}

//Increment unread notification every time new notification received
export function incrementUnreadNotifications(){
	return dispatch => {
		return axios.post('api/users/notifications/increment-unread')
	}
}

//Update unread notifications

export function updateUnreadNotificationsState(){
	return {
		type: UPDATE_UNREAD_NOTIFICATIONS
	}
}