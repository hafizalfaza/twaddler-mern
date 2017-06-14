import React from 'react';
import {connect} from 'react-redux';

class CollectedPostsStatus extends React.Component{
	render(){
		const {collectedPostsCount} = this.props;
		if(collectedPostsCount){
			if(collectedPostsCount!=0){
				if(collectedPostsCount==1){
					return(
						<div className="alert alert-success text-center" onClick={this.props.revealCollectedPosts}>
							View {collectedPostsCount} more post
						</div>
					);
				}else{
					return(
						<div className="alert alert-success text-center" onClick={this.props.revealCollectedPosts}>
							View {collectedPostsCount} more posts
						</div>
					);
				}				
			}else{
				return false;
			}		
		}else{
			return false;
		}
			
	}
}

function mapStateToProps(state){
	return {
		collectedPostsCount: state.newsfeed.collectedPostsCount
	}
}

export default connect(mapStateToProps)(CollectedPostsStatus);