import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER, UPDATE_CURRENT_USER } from './types';


//  Set current use after successful login
export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user,
  };
}

export function updateCurrentUser(newUserData) {
  return {
    type: UPDATE_CURRENT_USER,
    newUserData,
  };
}

//  Logout action
export function logout() {
  return (dispatch) => {
    localStorage.removeItem('jwtToken');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  };
}


// User login request
export function userLoginRequest(data) {
  return (dispatch) => {
    return axios.post('/api/auth', data).then((res) => {
      const token = res.data.token;
      localStorage.setItem('jwtToken', token);
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token)));
    });
  };
}
