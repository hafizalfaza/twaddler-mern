import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {likeThis, dislikeThis, addCommentToInitialPosts} from '../../../../actions/timelineActions';
import {postComment} from '../../../../actions/commentActions';
import $ from 'jquery';
import CommentSection from '../CommentSection/CommentSection'


class InitialPost extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isLiking: false,
			likedId: null,
			likedByUsers: null,
			commentActive: false,
			commentTextInput: ''
		}
		this.like = this.like.bind(this);
		this.assignLikeStatus = this.assignLikeStatus.bind(this);
		this.onClickComment = this.onClickComment.bind(this);
		this.onTypingComment = this.onTypingComment.bind(this);
		this.onPostComment = this.onPostComment.bind(this);
		this.onCommentSectionBlur = this.onCommentSectionBlur.bind(this);
	}
	


	componentWillMount(){
		this.assignLikeStatus();
		this.setState({likedByUsers: this.props.initialPost.likedBy});
	}
	
	assignLikeStatus(){
			const isLikedByCurrentUser = $.inArray(this.props.user.user.username, this.props.initialPost.likedBy);
			
			if(isLikedByCurrentUser==-1){
				this.setState({liked: false, numberOfLikes: this.props.initialPost.likes})
			}else{
				this.setState({liked: true, numberOfLikes: this.props.initialPost.likes})
			}
		}
	
	
	
	like(e){
		const data = {likedId: e.target.id, triggeredBy: this.props.user.id, liked: this.state.liked}
		e.preventDefault();
		if(!this.state.isLiking){
			this.setState({isLiking: true});
			if(!this.state.liked){			
				this.props.likeThis(data).then(
					(res) => {					
						this.setState({liked: true, numberOfLikes: res.data.postLiked.likes, likedByUsers: res.data.postLiked.likedBy, isLiking: false})
						this.props.sendNotification(res.data)
						
					},
					(err) => this.setState({errors: err.response.data, isLiking: false})
				);
			}else{
				this.props.likeThis(data).then(
					(res) => {		
						this.setState({liked: false, numberOfLikes: res.data.postLiked.likes, likedByUsers: res.data.postLiked.likedBy, isLiking: false})
					},
					(err) => this.setState({errors: err.response.data, isLiking: false})
				);
			}
		}else{
			return false;
		}		
	}
	
	
	
	onClickComment(e){
		e.preventDefault();
		if(this.state.commentActive){
			this.setState({commentActive: false})
		}else{
			this.setState({commentActive: true})
		}
		
	}
	
	
	onTypingComment(e){
		this.setState({commentTextInput: e.target.value})
	}
	
	
	onPostComment(e){
		if(this.state!=''){
			const data = {postId: e.target.name, comment: this.state.commentTextInput}
			this.props.postComment(data).then(
				(res) => {
					this.setState({commentTextInput: ''})
					// res.data.postCommented[0].postedBy
					this.props.sendNotification(res.data)
					this.props.addCommentToInitialPosts(res.data)
					
				},
				(err) => this.setState({commentTextInput: ''})
			)
		}		
	}
	
	onCommentSectionBlur(){
		// this.setState({commentActive: false})
	}
	
	
	render(){
		const {_id, postedBy, text, postDate, likes, likedBy, commentsCount} = this.props.initialPost;
		const {comments} = this.props;
		
		const {liked, numberOfLikes, likedByUsers, commentActive} = this.state;
		const love_on = require('./love_on.png');
		const love_off = require('./love_off.png');
		const comment = require('./comment.png');
		const oneLikesThis = likedByUsers + " likes this"
		const twoLikeThis = likedByUsers[0] +" and "+likedByUsers[1]+" like this";
		const threeLikeThis = likedByUsers[0] +", "+likedByUsers[1]+ ", and " + likedByUsers[2]+  " like this";
		const peopleLikeThis = likedByUsers[2] +", "+likedByUsers[3]+", and " + (likedByUsers.length-2) +" others like this";
		const profileLink = "/profile/" + postedBy;
		const commentInput = (
		<div>
			<div style={{paddingTop: 10}}>
			<CommentSection comments={this.props.comments}/>
			</div>
			<div className="input-group" style={{paddingTop: 15}}>			
			   <input type="text" className="form-control"  value={this.state.commentTextInput}onChange={this.onTypingComment} autoFocus/>
			   <span className="input-group-btn">
					<button className="btn btn-default" name={_id} type="button" onClick={this.onPostComment}>comment</button>
			   </span>
			</div>
		</div>);

		return(
			<div>
				<div className="media well" style={{paddingBottom: 10}}>
				  <div className="media-left">
					<img src="http://www.synbio.cam.ac.uk/images/avatar-generic.jpg" className="media-object" style={{width: 50}}/>
				  </div>
				  <div className="media-body">
					<h4 className="media-heading"><Link to= {profileLink}>{postedBy}</Link>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{fontSize: 10}}>{postDate}</span></h4>
					<p>{text}</p>
					<div className="pull-left">
						<a href="#" onClick={this.onClickComment} style={{textDecoration: 'none'}}><span ><img   src={comment} style={{width: 14}}/></span></a>&nbsp;<span>{commentsCount}</span>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					   <a  href="#"  id={_id}  onClick={this.like} style={{textDecoration: 'none'}}><img id={_id}   src={liked ? love_on : love_off} style={{width: 11}} /> </a><span style={{fontSize: 12}}>{numberOfLikes}</span>
					 </div>
				  </div>
				  
				  {commentActive ? commentInput : null}
				</div>
				
			</div>
		);
	}
}

InitialPost.propTypes = {
	initialPost: PropTypes.object.isRequired,
	likeThis: PropTypes.func.isRequired,	
}

function mapStateToProps(state){
	return state.auth;
}

export default connect(mapStateToProps, {likeThis, dislikeThis, postComment, addCommentToInitialPosts})(InitialPost);