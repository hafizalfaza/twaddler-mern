import { GET_USER_INFORMATION, SET_PROFILE_DATA } from '../actions/types';

export default(state = [], action = {}) => {
  switch (action.type) {
    case SET_PROFILE_DATA:
      return action.data;
    default: return state;
  }
};
