import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NavigationBar from '../NavigationBar';
import { getProfileData, setProfileData, updateProfileData, storeNewProfileData } from '../../actions/profileActions';
import NewsfeedTimeline from '../newsfeed/NewsfeedTimeline';
import $ from 'jquery';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editProfileActive: false,
      fullName: '',
      username: '',
      bio: '',
      profilePic: '',
      isFollowedByCurrentUser: false,
      followButtonState: {
        className: 'btn btn-success btn-sm center-block',
        text: 'Following',
      }
    };
    this.editProfile = this.editProfile.bind(this);
    this.onTyping = this.onTyping.bind(this);
    this.onSaveChange = this.onSaveChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onHoverFollowButton = this.onHoverFollowButton.bind(this);
    this.onLeaveFollowButton = this.onLeaveFollowButton.bind(this);
  }

  componentDidMount() {
    const username = this.props.match.params.username;
    this.props.getProfileData(username).then(
      res => this.props.setProfileData(res.data)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.username !== nextProps.match.params.username) {
      const username = nextProps.match.params.username;
      this.props.getProfileData(username).then(
        res => this.props.setProfileData(res.data)
      );
    }
    if (nextProps.profileData.userInfo) {
      const followingStatus = $.inArray(this.props.auth.user.id, nextProps.profileData.userInfo.following);
      if (followingStatus === -1) {
        this.setState({ isFollowedByCurrentUser: false });
      } else {
        this.setState({ isFollowedByCurrentUser: true });
      }
    }
  }

  editProfile(e) {
    e.preventDefault();
    const { fullName, username, bio, profilePic } = this.props.profileData.userInfo;
    if (bio) {
      this.setState({
        fullName,
        username,
        bio,
        profilePic,
      }, () => this.setState({ editProfileActive: true }));
    } else {
      this.setState({
        fullName,
        username,
        bio: '',
        profilePic,
      }, () => this.setState({ editProfileActive: true }));
    }
  }

  onHoverFollowButton() {
    const followingStatus = $.inArray(this.props.auth.user.id, this.props.profileData.userInfo.following);
    if (followingStatus !== -1) {
      this.setState({ followButtonState: { className: 'btn btn-danger btn-sm center-block', text: 'Unfollow' } });
    }
  }

  onLeaveFollowButton() {
    const followingStatus = $.inArray(this.props.auth.user.id, this.props.profileData.userInfo.following);
    if (followingStatus !== -1) {
      this.setState({ followButtonState: { className: 'btn btn-success btn-sm center-block', text: 'Following' } });
    }
  }

  onTyping(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSaveChange() {
    const newProfileData = { fullName: this.state.fullName, bio: this.state.bio, profilePic: this.state.profilePic };
    this.props.updateProfileData(newProfileData)
      .then(
        (res) => {
          this.props.storeNewProfileData(newProfileData);
          this.setState({ editProfileActive: false });
        }
      );
  }

  onCancel() {
    this.setState({ editProfileActive: false, username: '', fullName: '', bio: '', profilePic: '' });
  }

  render() {
    const { auth } = this.props;
    const { editProfileActive, isFollowedByCurrentUser, followButtonState } = this.state;
    const { profileData } = this.props;
    const { userInfo } = profileData;
    const loading = require('./loading.gif');
    const profileSettings = (
      <a href='#' onClick={ this.editProfile }>
        <i className='glyphicon glyphicon-cog'></i>&nbsp;
        Edit Profile
      </a>);

    if (this.props.profileData.userInfo) {
      const isCurrentUserProfile = this.props.auth.user.id === this.props.profileData.userInfo._id;
      const fullName = (<span style={ { fontSize: 20, fontWeight: 'bold' } }>{ userInfo.fullName }</span>);
      const username = (<span style={ { fontSize: 17 } }>@{ userInfo.username }</span>);
      const bio = (<span style={ { fontSize: 15 } }>{ userInfo.bio }</span>);
      const editFullName = (<input type='text' name='fullName' value={ this.state.fullName } onChange={ this.onTyping } autoFocus/>);
      const editBio = (<input type='text' name='bio' value={ this.state.bio } onChange={ this.onTyping } placeholder='Type your bio'/>);
      const editProfilePic = (<input type='text' name='profilePic' value={ this.state.profilePic } onChange={ this.onTyping } placeholder='Paste picture url'/>);
      const followButton = (
        <div className='center-block' style={ { border: '1px solid black', width: 150 } }>
          <button type='button' onMouseEnter={ this.onHoverFollowButton } onMouseLeave={ this.onLeaveFollowButton } className={ isFollowedByCurrentUser ? followButtonState.className : 'btn btn-primary btn-sm center-block' } style={ { width: 70 } }>{ isFollowedByCurrentUser ? followButtonState.text : '+ Follow' }</button>
        </div>
      );
      const saveChangeButton = (
        <div className='center-block' style={ { border: '1px solid black', width: 170 } }>
          <button type='button' className='btn btn-danger btn-sm' style={ { width: 60 } } onClick={ this.onCancel }>Cancel</button>
          <button type='button' className='btn btn-primary btn-sm pull-right' style={ { width: 100 } } onClick={ this.onSaveChange }>Save Change</button>
        </div>);

      return (
        <div>
          <NavigationBar />
          <div className='container' style={ { border: '1px solid black' } }>
            <div className='row profile' style={ { border: '1px solid blue' } }>
              <div className='col-md-3' style={ { border: '1px solid purple' } }>
                <div className='profile-sidebar' style={ { border: '1px solid red' } }>
                  <div className='profile-userpic'>
                    <img src={ userInfo.profilePic } className='img-responsive center-block' style={ { width: 150 } }alt=''/>
                  </div>
                  <div className='profile-usertitle'>
                    <div className='profile-usertitle-name text-center'>
                      <div style={ { padding: 8 } }>
                        <div>{ editProfileActive ? editFullName : fullName }</div>
                        <div>{ username }</div>
                        <div>{ editProfileActive ? editBio : bio }</div>
                        <div>{ editProfileActive ? editProfilePic : null }</div>
                      </div>
                    </div>
                  </div>
                  <div className='profile-userbuttons center-block' style={ { border: '1px solid gray' } }>
                    { editProfileActive ? saveChangeButton : isCurrentUserProfile ? null : followButton }
                  </div>
                  <div className='profile-usermenu'>
                    <ul className='nav'>
                      <li className='active'>
                        <a href='#'>
                          Posts: { userInfo.posts }
                        </a>
                      </li>
                      <li>
                        <a href='#'>
                          Following: { userInfo.followingNum }
                        </a>
                      </li>
                      <li>
                        <a href='#' target='_blank'>
                          Followers: { userInfo.followersNum }
                        </a>
                      </li>
                      <li>
                        {auth.isAuthenticated && profileData.userInfo.username === auth.user.user.username ? profileSettings : null}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='col-md-8'>
                <div className='profile-content col-md-8' style={ { marginLeft: 100 } }>
                  <NewsfeedTimeline initialPosts={ profileData.posts }/>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div><NavigationBar /><div className='container'><div className='col-md-4 col-md-offset-4'><img src={ loading }/></div></div></div>;
    }
  }
}

UserProfile.contextTypes = {
  router: PropTypes.object.isRequired,
};

UserProfile.propTypes = {
  auth: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    initialPosts: state.newsfeed,
    profileData: state.profile,
  };
}

export default connect(mapStateToProps, { getProfileData, setProfileData, updateProfileData, storeNewProfileData })(UserProfile);
