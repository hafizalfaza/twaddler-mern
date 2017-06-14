import {combineReducers} from 'redux';
import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';
import search from './reducers/search';
import notification from './reducers/notification';
import socket from './reducers/socket';
import newsfeed from './reducers/newsfeed';


//Reducers combination
const appReducer = combineReducers({
	flashMessages,
	auth,
	search,
	notification,
	socket,
	newsfeed,
})


//Root reducer set for resetable store
export const rootReducer = (state, action) => {
  if (action.type === 'RESET_REDUX_STATE') {
    state = undefined
  }

  return appReducer(state, action)
}