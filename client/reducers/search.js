import { FETCH_SEARCH_RESULT, RESET_SEARCH_STATE } from '../actions/types';

export default (state = [], action = {}) => {
  switch (action.type) {
    case FETCH_SEARCH_RESULT:
      return [
        ...state,
        {
          id: action.searchResultData.id,
          fullName: action.searchResultData.fullName,
          username: action.searchResultData.username,
          bio: action.searchResultData.bio,
          profilePic: action.searchResultData.profilePic,
          following: action.searchResultData.following,
          followers: action.searchResultData.followers,
        },
      ];
    case RESET_SEARCH_STATE:
      return [];
    default: return state;
  }
};
