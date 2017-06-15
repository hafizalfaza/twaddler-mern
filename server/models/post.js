import mongoose from 'mongoose';
import config from '../config/database';
import {User} from './user';

const PostSchema = mongoose.Schema({
	postedBy: {
		type: String,
		required: true
	},
	text: {
		type: String
	},
	fileUrl: {
		type: String
	},
	postDate: {
		type: Date,
		default: Date.now,
		required: true
	},
	charCount: {
		type: Number,
		default: 0,
		required: true
	},
	comments: {
		type: Array
	},
	commentsCount: {
		type: Number,
		default: 0,
		required: true
	},
	likes: {
		type: Number,
		default: 0,
		required: true
	},	
	likedBy: {
		type: Array
	}
});

export const Post = mongoose.model('Post', PostSchema);

export function getInitialPostsByCurrentUser(following, callback){
	const query = {postedBy: {$in : following}}
	const select = {__v:0}
	Post.find(query, select, callback).sort({postDate: -1}).limit(50);
}

export function getRecentPostsByCurrentUser(following, latestPost, callback){
	if(latestPost!="false"){
		const query = {postedBy: {$in: following}, postDate: {$gt: latestPost}}
		const select = {__v:0}
		Post.find(query, select, callback).sort({postDate: -1});
	}else{
		const query = {postedBy: {$in: following}}
		const select = {__v:0}
		Post.find(query, select, callback).sort({postDate: -1});
	}			
}

export function getPostsForProfile(userId, callback){
	const query = {postedBy: userId};
	const select = {__v:0};
	Post.find(query, select, callback).sort({postDate: -1});
}

export function addPostToDB(newPost, user, callback){

	User.update({_id: user}, {$inc: {posts: 1}}, () => newPost.save(callback));
}


export function addUserToPostLikes(user, id, liked, callback){
	if(!liked){
		Post.update({ _id: id }, { $addToSet: {likedBy: user }, $inc: { likes: 1} }, () => {
			Post.find({_id: id}, callback)
		})
		
	}else{
		Post.update({ _id: id }, { $pull: {likedBy: user }, $inc: { likes: -1} }, () => {
			Post.find({_id: id}, callback)
		})
	}
	
}

export function getPostByPostId(postId, callback){
	Post.find({_id: {$in: postId}}, callback)
}


export function addCommentToDB(commentData, callback){
	Post.update({_id: commentData.postId}, {$addToSet: {comments: commentData.commentData}, $inc: {commentsCount: 1}}, () => {
		Post.find({_id: commentData.postId}, callback)
	})
}