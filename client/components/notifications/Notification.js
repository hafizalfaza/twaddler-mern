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
  }

  componentWillMount() {
    if (this.props.notification.postData) {
      this.setState({ notificationData: this.props.notification.postData });
    }
  }

  render() {
    const { notificationId, type, date, likedBy, postData, triggeredBy, comment } = this.props.notification;
    const { notificationData } = this.state;
    const currentUser = this.props.auth.user.user.username;
    const followStatement = triggeredBy + ' is now following you';
    const loveOn = require('./love_on.png');
    const commentIcon = require('./comment.png');
    const follow = require('./follow.png');
    const profileLink = `/profile/${triggeredBy}`;
    const currentUserProfileLink = `/profile/${currentUser}`;
    const likeNotification = (<div>
      <div className='media well'>
        <div><img src='http://www.synbio.cam.ac.uk/images/avatar-generic.jpg' className='media-object' style={ { width: 30, display: 'inline-block' } }/>&nbsp;&nbsp;&nbsp;<span><Link to={ profileLink }>{ triggeredBy }</Link></span> liked this post <img src={ loveOn } style={ { width: 15 } } /></div>
        <div className='media well'>
          <div className='media-left'>
            <img src='http://www.synbio.cam.ac.uk/images/avatar-generic.jpg' className='media-object' style={ { width: 50 } } />
          </div>
          <div className='media-body'>
            <h4 className='media-heading'><Link to={currentUserProfileLink}>{currentUser}</Link>&nbsp;&nbsp;&nbsp;&nbsp;<span style={ { fontSize: 10 } }>{ notificationData.postDate }</span></h4>
            { postData ? postData.text : null }
          </div>
        </div>
      </div>
    </div>);

    const commentNotification = (<div>
      <div className='media well'>
        <div><img src='http://www.synbio.cam.ac.uk/images/avatar-generic.jpg' className='media-object' style={ { width: 30, display: 'inline-block' } }/>&nbsp;&nbsp;&nbsp;<span><Link to={profileLink}>{ triggeredBy }</Link></span> commented on your post <img src={ commentIcon } style={ { width: 15 } } /></div>
        <div style={ { paddingTop: 20, paddingLeft: 20 } }><p>{ comment }</p></div>
        <div className='media well'>
          <div className='media-left'>
            <img src='http://www.synbio.cam.ac.uk/images/avatar-generic.jpg' className='media-object' style={ { width: 50 } }/>
          </div>
          <div className='media-body'>
            <h4 className='media-heading'><Link to={ currentUserProfileLink }>{ currentUser }</Link>&nbsp;&nbsp;&nbsp;&nbsp;<span style={ { fontSize: 10 } }>{ notificationData.postDate }</span></h4>
            { postData ? postData.text : null }
          </div>
        </div>
      </div>
    </div>);

    const followNotification = (<div>
      <div className='media well'>
        <div><img src='http://www.synbio.cam.ac.uk/images/avatar-generic.jpg' className='media-object' style={ { width: 30, display: 'inline-block' } }/>&nbsp;&nbsp;<span><Link to={ profileLink }>{ triggeredBy }</Link></span> started following you <img src={ follow } style={ { width: 40 } } /></div>
      </div>
    </div>);

    return (
      <div>
        { type === 'POST_LIKE' ? likeNotification : type === 'POST_COMMENT' ? commentNotification : type === 'FOLLOW' ? followNotification : null }
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
