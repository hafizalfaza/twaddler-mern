import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {followRequest} from '../../actions/followActions';
import $ from 'jquery';
import {Link} from "react-router-dom";
import io from 'socket.io-client';
let socket = io(`http://localhost:3000`);

class SearchResult extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			userRequested: '',
			isLoading: false,
			following: null,
			followed: null,
			buttonStyle: {class: "btn btn-success btn-sm", text: "Following"},
			profileClicked: '',
		}
		this.followRequest = this.followRequest.bind(this);
		this.hoverToFollowButton = this.hoverToFollowButton.bind(this);
		this.leaveButton = this.leaveButton.bind(this);
		this.clickUser = this.clickUser.bind(this);
		this.sendNotification = this.sendNotification.bind(this);
	}
	
	componentWillMount(){
		const isFollowingCurrentUser = $.inArray(this.props.user.id, this.props.eachData.following);
		const isFollowedByCurrentUser = $.inArray(this.props.user.id, this.props.eachData.followers);
		
		if(isFollowedByCurrentUser!=-1){
			this.setState({following: true})
		}else{
			this.setState({following: false})
		}
		
		if(isFollowingCurrentUser!=-1){
			this.setState({followed: true})
		}else{
			this.setState({followed: false})
		}
		
	}
	
	
	hoverToFollowButton(){
		if(this.state.following){
			this.setState({buttonStyle: {class: "btn btn-danger btn-sm", text: "Unfollow"}})
		}else{
			return false;
		}
	}	
	
	
	leaveButton(){
		if(this.state.following){
			this.setState({buttonStyle: {class: "btn btn-success btn-sm", text: "Following"}})
		}else{
			return false;
		}
	}
	
	sendNotification(notificationData){
		socket.emit('send-notification', notificationData);
	}
	
	followRequest(e){
		this.setState({isLoading: true, userRequested: e.target.name},
		() => this.props.followRequest(this.state).then(
				(res) => {
					if(this.state.following){
						this.setState({following: false, isLoading: false})
						
					}else{
						this.setState({following: true, isLoading: false})
						this.sendNotification(res.data)
					}
				},
				(err) => this.setState({errors: err.response.data})
			)
		);		
	}
	
	clickUser(e){
		e.preventDefault();
		this.setState({profileClicked: e.target.name}, () => 
		this.context.router.history.push('/profile/'+this.state.profileClicked));
	}
	
	render(){
		const {id,fullName, username, bio} = this.props.eachData;
		const {isLoading, following, followed, buttonStyle, profileClicked} = this.state;
		const followsYou = "FOLLOWS YOU";
		
		return(
			<div>
				<div className="media">
				  <div className="media-left">
					<span>image</span>
				  </div>
				  <div className="media-body">
					<h4 className="media-heading"><a href="#" name={username} onClick={this.clickUser}>{username}</a>&nbsp;&nbsp;&nbsp;&nbsp;<button name={id} onClick={this.followRequest}  onMouseEnter={this.hoverToFollowButton} onMouseLeave={this.leaveButton} className={following  ? buttonStyle.class : "btn btn-primary btn-sm"} disabled={isLoading}>{following ? buttonStyle.text : "+ Follow"}</button></h4>
					<p>{fullName}&nbsp;&nbsp;&nbsp;&nbsp;{followed ? followsYou : false}</p>
				  </div>
				</div>
			</div>
		);
	}
}

SearchResult.propTypes = {
	eachData: PropTypes.object.isRequired,
	followRequest: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
}

SearchResult.contextTypes = {
	router: PropTypes.object.isRequired
}

function mapStateToProps(state){
	return state.auth;
}

export default connect(mapStateToProps, {followRequest})(SearchResult);