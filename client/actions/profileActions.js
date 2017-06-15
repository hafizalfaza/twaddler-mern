import axios from 'axios';

// Get user information for profile
export function getUserInformation(username) {
  return (dispatch) => {
    return axios.get(`/api/users/info/${username}`);
  };
}
