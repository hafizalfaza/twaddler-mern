import mongoose from 'mongoose';
import {User} from './user';



export const NotificationSchema = mongoose.Schema({
	userNotificationId: {
		type: String,
		required: true
	},
	like: {
		type: Array
	},
	comment: {
		type: Array
	},
	follow: {
		type: Array
	},
	mention: {
		type: Array
	}
	
});

export const Notification = mongoose.model('Notification', NotificationSchema)


export function setNotificationDB(newNotificationSet, callback){
	newNotificationSet.save(callback);
}



export function addNotificationToDB(item , triggeredBy, activityType, additionalId, callback){
	const notificationId = Math.random().toString(36).slice(2);
	
	if(activityType==="POST_LIKE"){		
		if(item[0].postedBy.toString()!=triggeredBy.toString()){
			const notificationData = {notificationId: notificationId, type: activityType, triggeredBy: triggeredBy, postId: item[0]._id, date: new Date().toISOString(), likedBy: item[0].likedBy}
			User.update({_id: item[0].postedBy}, {$inc: {unreadNotifications: 1}}, () => {
				Notification.update({userNotificationId: item[0].postedBy}, {$addToSet: {like: notificationData}}, callback);		
			});	
		}		
	}
	
	if(activityType==="POST_COMMENT"){		
		if(item[0].postedBy.toString()!=triggeredBy.toString()){
			const notificationData = {notificationId: notificationId, type: activityType, triggeredBy: triggeredBy, postId: item[0]._id, date: new Date().toISOString(), commentId: additionalId}
			User.update({_id: item[0].postedBy}, {$inc: {unreadNotifications: 1}}, () => {
				Notification.update({userNotificationId: item[0].postedBy}, {$addToSet: {comment: notificationData}}, callback);		
			});	
		}		
	}
	
	if(activityType==="FOLLOW"){
		
		if(item.userRequested.toString()!=triggeredBy.toString()){
			
			const notificationData = {notificationId: notificationId, type: activityType, triggeredBy: triggeredBy, date: new Date().toISOString()}
			
			User.update({_id: item.userRequested}, {$inc: {unreadNotifications: 1}}, () => {
				Notification.update({userNotificationId: item.userRequested}, {$addToSet: {follow: notificationData}}, callback);
			});		
		}
	}
	
	if(activityType==="USER_MENTION") {
		
		for(let i = item.mentionedUserArray.length-1; i >=0; i-- ){
			if(item.mentionedUserArray[i].toString() === triggeredBy.toString()){
				item.mentionedUserArray.splice(i, 1);
			}
		}
		const notificationData = {notificationId: notificationId, type: activityType, triggeredBy: triggeredBy, postId: item.postId, date: new Date().toISOString()}

		User.update({_id: {$in: item.mentionedUserArray}}, {$inc: {unreadNotifications: 1}}, () => {
			Notification.update({userNotificationId: {$in : item.mentionedUserArray}}, {$addToSet: {mention: notificationData}}, callback);
		});		
		
	}
	
}


export function getNotificationsByUserId(userId, callback){
	Notification.find({userNotificationId: userId}, {_id: 0, like: 1, follow: 1, comment: 1}, callback)
}

export function incrementUnreadNotifications(userId, callback){
	User.update({_id: userId}, {$inc: {unreadNotifications: 1}}, callback)
}