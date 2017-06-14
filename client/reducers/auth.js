import {SET_CURRENT_USER} from '../actions/types';
import isEmpty from 'lodash/isEmpty';

const initialState = {
	isAuthenticated: false,
	user: {}
};

//Reducer for current user
export default (state = initialState, action = {}) => {
	switch(action.type) {
		case SET_CURRENT_USER:
			return {
				isAuthenticated: !isEmpty(action.user),
				user: action.user
			}
			
		default: return state;
	}
}