import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { likeThis, dislikeThis, addCommentToInitialPosts } from '../../../../actions/timelineActions';
import { postComment } from '../../../../actions/commentActions';
import { addCommentToProfilePosts } from '../../../../actions/profileActions';
import $ from 'jquery';
import CommentSection from '../CommentSection/CommentSection';


class InitialPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLiking: false,
      likedId: null,
      liked: false,
      likedByUsers: null,
      commentActive: false,
      commentTextInput: '',
      postHover: false,
      commentHover: false,
      likeHover: false,
    };
    this.like = this.like.bind(this);
    this.assignLikeStatus = this.assignLikeStatus.bind(this);
    this.onClickComment = this.onClickComment.bind(this);
    this.onTypingComment = this.onTypingComment.bind(this);
    this.onPostComment = this.onPostComment.bind(this);
    this.transpileText = this.transpileText.bind(this);
    this.onPostLeave = this.onPostLeave.bind(this);
    this.onPostHover = this.onPostHover.bind(this);
    this.onCommentHover = this.onCommentHover.bind(this);
    this.onCommentLeave = this.onCommentLeave.bind(this);
    this.onLikeHover = this.onLikeHover.bind(this);
    this.onLikeLeave = this.onLikeLeave.bind(this);
  }

  componentWillMount() {
    if (this.props.user.user) {
      this.assignLikeStatus();
    }
    this.setState({ likedByUsers: this.props.initialPost.likedBy });
  }

  assignLikeStatus() {
    if (this.props.profileRoute) {
      const isLikedByCurrentUser = $.inArray(this.props.user.id, this.props.initialPost.likedBy);
      if (isLikedByCurrentUser === -1) {
        this.setState({ liked: false, numberOfLikes: this.props.initialPost.likes });
      } else {
        this.setState({ liked: true, numberOfLikes: this.props.initialPost.likes });
      }
    } else {
      const isLikedByCurrentUser = $.inArray(this.props.user.user.username, this.props.initialPost.likedBy);
      if (isLikedByCurrentUser === -1) {
        this.setState({ liked: false, numberOfLikes: this.props.initialPost.likes });
      } else {
        this.setState({ liked: true, numberOfLikes: this.props.initialPost.likes });
      }
    }
  }

  like(e) {
    e.preventDefault();
    if (this.props.user) {
      const data = { likedId: e.target.id, triggeredBy: this.props.user.id, liked: this.state.liked };
      if (!this.state.isLiking) {
        this.setState({ isLiking: true });
        if (!this.state.liked) {
          this.props.likeThis(data).then(
            (res) => {
              this.setState({ liked: true, numberOfLikes: res.data.postLiked.likes, likedByUsers: res.data.postLiked.likedBy, isLiking: false });
              this.props.sendNotification(res.data);
            },
            (err) => { this.setState({ errors: err.response.data, isLiking: false }); },
          );
        } else {
          this.props.likeThis(data).then(
            (res) => {
              this.setState({ liked: false, numberOfLikes: res.data.postLiked.likes, likedByUsers: res.data.postLiked.likedBy, isLiking: false });
            },
            (err) => { this.setState({ errors: err.response.data, isLiking: false }); },
          );
        }
      }
    } else {
      this.context.router.history.push('/');
    }
  }

  onClickComment(e) {
    e.preventDefault();
    if (this.props.user) {
      if (this.state.commentActive) {
        this.setState({ commentActive: false });
      } else {
        this.setState({ commentActive: true });
      }
    } else {
      this.context.router.history.push('/');
    }
  }

  onTypingComment(e) {
    this.setState({ commentTextInput: e.target.value });
  }

  onPostComment(e) {
    if (this.state.commentTextInput !== '') {
      const data = { postId: e.target.name, comment: this.state.commentTextInput };
      this.props.postComment(data).then(
        (res) => {
          this.setState({ commentTextInput: '' });
          this.props.sendNotification(res.data);
          this.props.addCommentToInitialPosts(res.data);
          if (this.props.profileRoute) {
            this.props.addCommentToProfilePosts(res.data);
          }
        },
        (err) => { this.setState({ commentTextInput: '' }); },
      );
    }
  }

  onPostHover() {
    this.setState({ postHover: true });
  }

  onPostLeave() {
    this.setState({ postHover: false });
  }

  onCommentHover() {
    this.setState({ commentHover: true });
  }

  onCommentLeave() {
    this.setState({ commentHover: false });
  }

  onLikeHover() {
    this.setState({ likeHover: true });
  }

  onLikeLeave() {
    this.setState({ likeHover: false });
  }

  transpileText(text) {
    const phraseArray = [];
    const textSplit = text.split(' ');
    for (let i = 0; i < textSplit.length; i++) {
      if (textSplit[i][0] !== '@') {
        phraseArray.push(textSplit[i]);
        phraseArray.push(' ');
      } else {
        const key = Math.random().toString(36).slice(2);
        phraseArray.push(<Link key={ key }to={ `/profile/${textSplit[i].slice(1, textSplit[i].length)}` }>{ textSplit[i] }</Link>);
        phraseArray.push(' ');
      }
    }
    return phraseArray;
  }

  render() {
    const { _id, postedBy, fullName, text, postDate, likes, likedBy, commentsCount, profilePic } = this.props.initialPost;
    const { comments } = this.props;
    const { liked, numberOfLikes, likedByUsers, commentActive, postHover, commentHover, likeHover } = this.state;
    const loveOn = require('./love_on.png');
    const loveOff = require('./love_off.png');
    const comment = require('./comment.png');
    const oneLikesThis = likedByUsers + ' likes this';
    const twoLikeThis = likedByUsers[0] + ' and ' + likedByUsers[1] + ' like this';
    const threeLikeThis = likedByUsers[0] + ', ' + likedByUsers[1] + ', and ' + likedByUsers[2] + ' like this';
    const peopleLikeThis = likedByUsers[2] + ', ' + likedByUsers[3] + ', and ' + (likedByUsers.length - 2) + ' others like this';
    const profileLink = `/profile/${postedBy}`;

    const convertedPostDate = new Date(postDate);
    const currentDate = new Date();

    const second = (currentDate - convertedPostDate) / 1000;
    const minute = second / 60;
    const hour = minute / 60;
    const day = hour / 24;
    const week = day / 7;
    const month = week / 30;
    const year = month / 12;

    const secondStatement = Math.floor(second) + 's';
    const minuteStatement = Math.floor(minute) + 'm';
    const hourStatement = Math.floor(hour) + 'h';
    const dayStatement = Math.floor(day) + 'd';
    const weekStatement = Math.floor(week) + 'w';
    const monthStatement = Math.floor(month) + 'mo';
    const yearStatement = Math.floor(year) + 'y';
    const recentStatement = 'a moment ago';

    const commentInput = (
      <div>
        <div style={ { paddingTop: 10 } }>
          <CommentSection comments={ this.props.comments } postHover={ postHover }/>
        </div>
        <div className="input-group" style={ { paddingTop: 15 } }>
          <input type="text" className="form-control" value={ this.state.commentTextInput }onChange={ this.onTypingComment } autoFocus/>
          <span className="input-group-btn">
            <button className="btn btn-default" name={ _id } type="button" onClick={ this.onPostComment }>comment</button>
          </span>
        </div>
      </div>);

    return (
      <div>
        <div className="media well" onMouseEnter={ this.onPostHover } onMouseLeave={ this.onPostLeave } style={ postHover ? { marginBottom: 0, backgroundColor: '#EDF2F5', cursor: 'pointer' } : { marginBottom: 0 } }>
          <div className="media-left">
            <img src={ profilePic } className="media-object img-rounded" style={ { width: 50 } }/>
          </div>
          <div className="media-body">
            <h4 className="media-heading"><Link to= { profileLink } style={ { fontSize: 15, fontWeight: 'bold' } }>@{ postedBy }</Link>&nbsp;<span style={ { fontSize: 13, color: 'gray' } }>{ fullName }</span>&nbsp;&bull;&nbsp;
              <span style={ { fontSize: 12, color: 'gray' } }>{ second >= 1 && minute < 1 ? secondStatement : minute >= 1 && hour < 1 ? minuteStatement : hour >= 1 && day < 1 ? hourStatement : day >= 1 && week < 1 ? dayStatement : recentStatement }</span>
            </h4>
            <p>{ this.transpileText(text) ? this.transpileText(text) : text }</p>
            <div className="pull-left">
              <span ><img onClick={ this.onClickComment } onMouseEnter={ this.onCommentHover } onMouseLeave={ this.onCommentLeave }src={ comment } style={ commentHover ? { width: 16 } : { width: 14 } }/></span>&nbsp;<span>{ commentsCount }</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img id={ _id } onClick={ this.like } onMouseEnter={ this.onLikeHover } onMouseLeave={ this.onLikeLeave } src={ liked ? loveOn : loveOff } style={ likeHover ? { width: 13 } : { width: 11 }} /><span style={ { fontSize: 12 } }>&nbsp;{ numberOfLikes }</span>
            </div>
          </div>
          { commentActive ? commentInput : null }
        </div>
      </div>
    );
  }
}

InitialPost.propTypes = {
  initialPost: PropTypes.object.isRequired,
  likeThis: PropTypes.func.isRequired,
};

InitialPost.contextTypes = {
  router: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return state.auth;
}

export default connect(mapStateToProps, { likeThis, dislikeThis, postComment, addCommentToInitialPosts, addCommentToProfilePosts })(InitialPost);
