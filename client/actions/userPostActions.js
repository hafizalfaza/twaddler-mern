import axios from 'axios';

// User post actions
export function userPostRequest(data) {
  return (dispatch) => {
    return axios.post('/api/users/post', data);
  };
}
