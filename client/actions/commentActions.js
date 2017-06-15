import axios from 'axios';

// Post comment action
export function postComment(comment) {
  return (dispatch) => {
    return axios.post('/api/users/post/comment', comment);
  };
}
