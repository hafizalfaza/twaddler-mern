import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, browserHistory} from 'react-router-dom';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import {rootReducer} from './rootReducer';
import setAuthorizationToken from './utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import {setCurrentUser} from './actions/loginActions';
import requireAuth from './utils/requireAuth';
import requireLogout from './utils/requireLogout';

import App from './components/App';
import LoginPage from './components/login/LoginPage';
import SignupPage from './components/signup/SignupPage';
import NewEventPage from './components/events/NewEventPage';
import Profile from './components/Profile';
import SearchResultPage from './components/search/SearchResultPage';
import UserProfile from './components/profile/UserProfile';
import NotificationsPage from './components/notifications/NotificationsPage';


//Redux store
const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(thunk),
		window.devToolsExtension ? window.devToolsExtension() : f => f		
	)
);


//Set current user from tokens
if(localStorage.jwtToken){
	setAuthorizationToken(localStorage.jwtToken);
	store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}


//Application routes
render(
<Provider store={store}>
<Router history={browserHistory}>
<div>
	<Route exact path="/" component={App} />
	<Route exact path="/profile/:username" component={UserProfile} />
	<Route exact path="/signup" component={requireLogout(SignupPage)} />
	<Route exact path="/search/str/:searchQuery" component={SearchResultPage} />
	<Route exact path="/user/notifications" component={requireAuth(NotificationsPage)} />
</div>
</Router>
</Provider>, document.getElementById('app'));