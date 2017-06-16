import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/database';

const UserSchema = mongoose.Schema({
	fullName: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	joinDate: {
		type: Date,
		default: Date.now,
		required: true
	},
	profilePic: {
		type: String,
		default: "http://www.synbio.cam.ac.uk/images/avatar-generic.jpg",
		required: true
	},
	bio: {
		type: String
	},
	posts: {
		type: Number,
		default: 0,
		required: true
	},
	following: {
		type: Array
	},
	followers: {
		type: Array
	},
	followingNum: {
		type: Number,
		default: 0,
		required: true
	},
	followersNum: {
		type: Number,
		default: 0,
		required: true
	},
	isProtected: {
		type: Boolean,
		default: false,
		required: true
	},
	notificationSetId:{
		type: String,
		default: Math.random().toString(36).slice(2),
		required: true
	},
	notificationsNum: {
		type: Number,
		default: 0,
		required: true
	},
	unreadNotifications: {
		type: Number,
		default: 0,
		required: true
	}
	

});

export const User = mongoose.model('User', UserSchema);

export function addUser(newUser, callback){
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if(err) throw err;
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

export function getUserByUsernameOrEmail(identifier, callback){
	const query = [{username: identifier}, {email: identifier}];
	
	User.findOne({
		 $or: query
	   }, callback);
}

export function getUserByUsername(username, callback){
	const query = {username: username};
	
	User.findOne(query, callback);
}

export function getUserById(id, callback){	
	const query = {_id: id}
	const select = {password:0, __v:0, }
	User.findOne(query, select, callback);
}

export function getUsernameById(id, callback){	
	const query = {_id: {$in: id}}
	const select = {_id: 1, username: 1, fullName: 1, profilePic: 1}
	User.find(query, select, callback);
}

export function getUserBySearchQuery(searchQuery, callback){	
	const query = {username: searchQuery}
	const select = {password:0, __v:0, }
	User.findOne(query, select, callback);
}


export function requestToFollow(userRequesting, userRequested, following, callback){
	if(!following){		
		User.update({ _id: userRequested }, { $addToSet: {followers: userRequesting}, $inc: {followersNum: 1}}, () => 
		User.update({_id: userRequesting}, {$addToSet: {following: userRequested}, $inc: {followingNum: 1}}, () => 
		User.find({_id: userRequested}, callback)));
	}else{			
		User.update({ _id: userRequested }, { $pull: {followers: userRequesting}, $inc: {followersNum: -1}}, () => 
		User.update({_id: userRequesting}, {$pull: {following: userRequested}, $inc: {followingNum: -1}}, () => 
		User.find({_id: userRequested}, callback)));
	}	
}

export function getFollowingByCurrentUser(currentUser, callback){
	User.find({_id: currentUser}, {_id:0, following:1}, callback);
}

export function resetUnreadNotifications(userId, callback){
	User.update({_id: userId}, {$set: {unreadNotifications: 0}}, callback)
}


export function updateProfileData(userId, newProfileData, callback){
	User.update({_id: userId}, {$set: {fullName: newProfileData.fullName, bio: newProfileData.bio, profilePic: newProfileData.profilePic}}, () => {
		User.find({_id: userId}, callback);
	});
}