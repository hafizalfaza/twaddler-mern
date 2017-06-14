import {SET_SOCKET_STATUS} from '../actions/types';

export default (state={socketEstablished: false}, action={}) => {
	switch(action.type){
		case SET_SOCKET_STATUS:
			return {
				socketEstablished: true
			}

		default: return state;
	}
}