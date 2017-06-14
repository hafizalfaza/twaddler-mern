import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import NavigationBar from '../NavigationBar';
import {getUserInformation} from '../../actions/profileActions';

class UserProfile extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			user: {}
		}
		this.updateUserInformation = this.updateUserInformation.bind(this);
	}

	componentWillMount(){
		this.props.getUserInformation(this.props.match.params.username).then(
			(res) => {
				this.setState({user: res.data.user})
			},
			(err) => this.setState({errors: err.response.data})
		);
	}
	
	componentWillReceiveProps(nextProps){
		this.updateUserInformation(nextProps);
	}
	
	
	updateUserInformation(nextProps){
		this.props.getUserInformation(nextProps.match.params.username).then(
			(res) => {
				this.setState({user: res.data.user})
			},
			(err) => this.setState({errors: err.response.data})
		);
	}
	
	render(){
		const {user} = this.state;
		const {username, posts, followersNum, followingNum, profilePic} = user;
		return(
			<div className="container-fluid">
				<div className="row">
					<NavigationBar />
				</div>
				<div className="">			
					<img src={profilePic} style={{width: 150}}/>
					<h2>{username} </h2>
				</div>					
			</div>
		);
	}
}

UserProfile.propTypes = {
	auth: PropTypes.object,
	getUserInformation: PropTypes.func.isRequired
}

function mapStateToProps(state){
	return state.auth
}

export default connect(mapStateToProps, {getUserInformation})(UserProfile);