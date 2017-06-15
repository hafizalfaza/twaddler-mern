import axios from 'axios';
import { SET_PROFILE_DATA } from './types';

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

