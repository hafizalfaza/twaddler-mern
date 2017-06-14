import axios from 'axios';
import {FETCH_SEARCH_RESULT, RESET_SEARCH_STATE} from './types';


//Search action
export function search(searchQuery){
	return dispatch => {
		return axios.get(`/search/str/${searchQuery}`)
	}
}

//Fetch search result action
export function fetchSearchResult(searchResultData){
		return {
			type: FETCH_SEARCH_RESULT,
			searchResultData
		}
}


//Reset search state for new search
export function resetSearchState(){
		return {
			type: RESET_SEARCH_STATE
		}
}