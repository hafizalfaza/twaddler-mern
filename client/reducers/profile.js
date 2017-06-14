import {GET_USER_INFORMATION} from '../actions/types';

export default(state=[], action={}){
	switch(action.type){
		case GET_USER_INFORMATION:
		return [
			...state,
			{
				
			}	
		];
		
		default: return state;
	}
}