import React from 'react';
import {Link} from 'react-router-dom';


class Comment extends React.Component{
	render(){
		const {comment, date, user, commentId} = this.props.comment;
		const profileLink = "/profile/"+ user;
		return(
			<div style={{padding: 5, backgroundColor: "#E3ECF3", "border": "1px solid #CAE9FF", fontSize: 12}}>
				<span style={{fontWeight: "bold"}}><Link to={profileLink}>{user}</Link></span>&nbsp;&nbsp;{comment}
			</div>
		);
	}
}

export default Comment;