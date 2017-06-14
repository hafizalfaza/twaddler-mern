import {ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE, SET_NOTIFICATION_STATE, UPDATE_UNREAD_NOTIFICATIONS, RESET_UNREAD_NOTIFICATION} from '../actions/types';
import findIndex from 'lodash/findIndex';
import shortid from 'shortid';

//Reducer for notifications
export default (state=[], action={}) => {
	switch(action.type){
		case SET_NOTIFICATION_STATE:
			if(state.unreadNotifications==0){
				return {
					notifications: action.notifications.notifications.notifications,
					unreadNotifications: 0,
				};
			}else{
				return action.notifications.notifications;
			}
			

		case UPDATE_UNREAD_NOTIFICATIONS:
			return {
				notifications: state.notifications,
				unreadNotifications: state.unreadNotifications + 1
			};
		case RESET_UNREAD_NOTIFICATION:
			return {
				notifications: state.notifications,
				unreadNotifications: 0
			}
		default: return state;
	}
}