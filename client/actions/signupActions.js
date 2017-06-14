import axios from 'axios';


//User signup request action
export function userSignupRequest(data){
	return dispatch => {
		return axios.post('/api/register', data);
	}
}

//Check if user exists
export function doesUserExist(identifier){
	return dispatch => {
		return axios.get(`/api/register/${identifier}`)
	}
}