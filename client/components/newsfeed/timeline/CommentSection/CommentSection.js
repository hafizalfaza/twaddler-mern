import React from 'react';
import CommentsList from './CommentsList';

class CommentSection extends React.Component{
	render(){
		
		if(this.props.comments){
			return(
				<div style={this.props.comments.length > 5 ? {height: 145, overflowY: "auto"} : null}>
					<CommentsList comments={this.props.comments}/>
				</div>
			);
		}else{
			return null;
		}
		
	}
}



export default CommentSection;