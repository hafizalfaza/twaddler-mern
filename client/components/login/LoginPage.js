import React from 'react';
import LoginForm from './LoginForm';
import {Link} from 'react-router-dom';

class LoginPage extends React.Component{
	render(){
		return(
		<div className="row" style={{position: "relative", top: 150}}>
			<div className="col-md-4 col-md-offset-4">
				<LoginForm receiveNotifications={this.props.receiveNotifications}/>
				Don't have an account? <Link to="/signup"> Sign up</Link>
			</div>
		</div>
		
		);
	}
}

export default LoginPage;