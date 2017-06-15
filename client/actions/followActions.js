import axios from 'axios';

// Follow request action
export function followRequest(userRequested) {
  return (dispatch) => {
    return axios.post('/api/users/follow', userRequested);
  };
}

