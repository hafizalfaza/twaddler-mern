import axios from 'axios';
import { SET_PROFILE_DATA, UPDATE_PROFILE_DATA, ADD_COMMENT_TO_PROFILE_POSTS } from './types';

// Get user information for profile
export function getProfileData(username) {
  return (dispatch) => {
    return axios.get(`/api/users/profile/${username}`);
  };
}

export function setProfileData(data) {
  return {
    type: SET_PROFILE_DATA,
    data,
  };
}

export function updateProfileData(newUserData) {
  return (dispatch) => {
    return axios.post('/api/users/profile/update', newUserData);
  };
}

export function storeNewProfileData(newProfileData) {
  return {
    type: UPDATE_PROFILE_DATA,
    newProfileData,
  };
}

export function addCommentToProfilePosts(data) {
  return {
    type: ADD_COMMENT_TO_PROFILE_POSTS,
    data,
  };
}
