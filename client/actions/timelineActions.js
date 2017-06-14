import axios from 'axios';
import {SET_INITIAL_POSTS, ADD_COMMENT_TO_INITIAL_POSTS, INJECT_POSTS_TO_NEWSFEED, REVEAL_COLLECTED_POSTS} from './types';

//Initial posts request action
export function requestInitialPosts(data){
	return dispatch => {
		return axios.get('/api/users/timeline/initial')
	}
}


//Store initial posts to redux store
export function setInitialPosts(initialPosts){
	return {
		type: SET_INITIAL_POSTS,
		initialPosts
	}
}

//Inject posts to existing newsfeed
export function injectPostsToNewsfeed(recentPosts){
	return {
		type: INJECT_POSTS_TO_NEWSFEED,
		recentPosts
	}
}

//Reveal collected posts saved in redux store
export function revealCollectedPosts(){
	return {
		type: REVEAL_COLLECTED_POSTS
	}
}

//Add comment to posts
export function addCommentToInitialPosts(data){
	return {
		type: ADD_COMMENT_TO_INITIAL_POSTS,
		data
	}
}

//Request recent posts action
export function requestRecentPosts(data){
	const url = `api/users/timeline/recent/latestPost?date=${data.latestPost}`;

	return dispatch => {
		return axios.get(url)
	}
}

//Like actions
export function likeThis(data){
	return dispatch => {
		return axios.post('/api/users/timeline/likes', data)
	}
}