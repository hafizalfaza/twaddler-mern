import React from 'react';
import NavigationBar from '../NavigationBar';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationData: {},
    };
    this.convertDate = this.convertDate.bind(this);
    this.transpileText = this.transpileText.bind(this);
  }

  componentWillMount() {
    if (this.props.notification.postData) {
      this.setState({ notificationData: this.props.notification.postData });
    }
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

  convertDate(date) {
    let correctDate = '';

    const convertedPostDate = new Date(date);
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

    if (second >= 1 && minute < 1) {
      correctDate = secondStatement;
    }

    if (minute >= 1 && hour < 1) {
      correctDate = minuteStatement;
    }

    if (hour >= 1 && day < 1) {
      correctDate = hourStatement;
    }

    if (day >= 1 && week < 1) {
      correctDate = dayStatement;
    }

    if (week >= 1 && month < 1) {
      correctDate = weekStatement;
    }

    if (month >= 1 && year < 1) {
      correctDate = monthStatement;
    }

    if (year > 1) {
      correctDate = yearStatement;
    }

    if (second < 1) {
      correctDate = 'a moment ago';
    }

    return correctDate;
  }


  render() {
    const { notificationId, type, date, likedBy, postData, triggeredBy, comment, profilePic } = this.props.notification;
    const currentUser = this.props.auth.user.user.username;
    const followStatement = triggeredBy + ' is now following you';
    const loveOn = require('./love_on.png');
    const commentIcon = require('./comment.png');
    const mentionIcon = require('./mention.png');
    const follow = require('./follow.png');
    const profileLink = `/profile/${triggeredBy}`;
    const currentUserProfileLink = `/profile/${currentUser}`;

    const likeNotification = (<div>
      <div className='media well' style={ { marginBottom: 0 } }>
        <div><img src={ profilePic ? profilePic : null } className='media-object' style={ { width: 30, display: 'inline-block' } }/>&nbsp;&nbsp;&nbsp;<span><Link to={ profileLink }>{ triggeredBy }</Link></span> liked this post <img src={ loveOn } style={ { width: 15 } } />&nbsp;&bull;&nbsp;
          <span style={ { color: 'gray', fontSize: 12 } }>{ this.convertDate(date) }</span>
        </div>
        <div className='media well'>
          <div className='media-left'>
            <img src={ postData ? postData.profilePic : null } className='media-object img-rounded' style={ { width: 50 } } />
          </div>
          <div className='media-body'>
            <h4 className='media-heading'><Link to={currentUserProfileLink}>{currentUser}</Link>&nbsp;&bull;&nbsp;<span style={ { color: 'gray', fontSize: 12 } }>{ postData ? this.convertDate(postData.postDate) : null }</span></h4>
            { postData ? this.transpileText(postData.text) : null }
          </div>
        </div>
      </div>
    </div>);

    const commentNotification = (<div>
      <div className='media well' style={ { marginBottom: 0 } }>
        <div><img src={ profilePic } className='media-object' style={ { width: 30, display: 'inline-block' } }/>&nbsp;&nbsp;&nbsp;<span><Link to={profileLink}>{ triggeredBy }</Link></span> commented on your post <img src={ commentIcon } style={ { width: 15 } } />&nbsp;&bull;&nbsp;
          <span style={ { color: 'gray', fontSize: 12 } }>{ this.convertDate(date) }</span>
        </div>
        <div style={ { paddingTop: 20, paddingLeft: 20 } }><p>{ comment }</p></div>
        <div className='media well'>
          <div className='media-left'>
            <img src={ postData ? postData.profilePic : null } className='media-object img-rounded' style={ { width: 50 } }/>
          </div>
          <div className='media-body'>
            <h4 className='media-heading'><Link to={ currentUserProfileLink }>{ currentUser }</Link>&nbsp;&bull;&nbsp;<span style={ { color: 'gray', fontSize: 12 } }>{ postData ? this.convertDate(postData.postDate) : null }</span></h4>
            { postData ? this.transpileText(postData.text) : null }
          </div>
        </div>
      </div>
    </div>);

    const followNotification = (<div>
      <div className='media well' style={ { marginBottom: 0 } }>
        <div><img src={ profilePic } className='media-object' style={ { width: 30, display: 'inline-block' } }/>&nbsp;&nbsp;<span><Link to={ profileLink }>{ triggeredBy }</Link></span> started following you <img src={ follow } style={ { width: 40 } } />&nbsp;&bull;&nbsp;
          <span style={ { color: 'gray', fontSize: 12 } }>{ this.convertDate(date) }</span>
        </div>
      </div>
    </div>);

    const mentionNotification = (<div>
      <div className='media well' style={ { marginBottom: 0 } }>
        <div><img src={ profilePic } className='media-object' style={ { width: 30, display: 'inline-block' } }/>&nbsp;&nbsp;&nbsp;<span><Link to={profileLink}>{ triggeredBy }</Link></span> mentioned you in a post <img src={ mentionIcon } style={ { width: 15 } } />&nbsp;&bull;&nbsp;
          <span style={ { color: 'gray', fontSize: 12 } }>{ this.convertDate(date) }</span>
        </div>
        <div className='media well'>
          <div className='media-left'>
            <img src={ profilePic } className='media-object img-rounded' style={ { width: 50 } }/>
          </div>
          <div className='media-body'>
            <h4 className='media-heading'><Link to={ `/profile/${triggeredBy}` }>{ triggeredBy }</Link>&nbsp;&bull;&nbsp;<span style={ { color: 'gray', fontSize: 12 } }>{ postData ? this.convertDate(postData.postDate) : null }</span></h4>
            { postData ? this.transpileText(postData.text) : null }
          </div>
        </div>
      </div>
    </div>);

    return (
      <div>
        { type === 'POST_LIKE' ? likeNotification : type === 'POST_COMMENT' ? commentNotification : type === 'FOLLOW' ? followNotification : type === 'USER_MENTION' ? mentionNotification : null }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Notification);
