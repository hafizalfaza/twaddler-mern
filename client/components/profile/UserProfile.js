import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NavigationBar from '../NavigationBar';
import { getProfileData, setProfileData, updateProfileData } from '../../actions/profileActions';
import { updateCurrentUser } from '../../actions/loginActions';
import NewsfeedTimeline from '../newsfeed/NewsfeedTimeline';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editProfileActive: false,
      fullName: '',
      username: '',
      bio: '',
      profilePic: '',
    };
    this.editProfile = this.editProfile.bind(this);
    this.onTyping = this.onTyping.bind(this);
    this.onSaveChange = this.onSaveChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    const username = this.props.match.params.username;
    this.props.getProfileData(username).then(
      res => this.props.setProfileData(res.data)
    );
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

  onTyping(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSaveChange() {
    const newProfileData = { fullName: this.state.fullName, username: this.state.username, bio: this.state.bio, profilePic: this.state.profilePic };
    this.props.updateProfileData(newProfileData)
      .then((res) => { this.props.updateCurrentUser(res.data.userData[0]); })
      .then(() => {
        this.setState({ editProfileActive: false });
        this.context.router.history.push(`/profile/${this.state.username}`);
      })
      .catch(err => console.log('error'));
  }

  onCancel() {
    this.setState({ editProfileActive: false, username: '', fullName: '', bio: '', profilePic: '' });
  }

  render() {
    const { auth } = this.props;
    const { editProfileActive } = this.state;
    const { profileData } = this.props;
    const { userInfo } = profileData;
    const profileSettings = (
      <a href='#' onClick={ this.editProfile }>
        <i className='glyphicon glyphicon-cog'></i>&nbsp;
        Edit Profile
      </a>);

    if (this.props.profileData.userInfo) {
      const fullName = (<span style={ { fontSize: 20, fontWeight: 'bold' } }>{ userInfo.fullName }</span>);
      const username = (<span style={ { fontSize: 17 } }>@{ userInfo.username }</span>);
      const bio = (<span style={ { fontSize: 15 } }>{ userInfo.bio }</span>);
      const editFullName = (<input type='text' name='fullName' value={ this.state.fullName } onChange={ this.onTyping } autoFocus/>);
      const editUsername = (<input type='text' name='username' value={ this.state.username } onChange={ this.onTyping }/>);
      const editBio = (<input type='text' name='bio' value={ this.state.bio } onChange={ this.onTyping } placeholder='Type your bio'/>);
      const editProfilePic = (<input type='text' name='profilePic' value={ this.state.profilePic } onChange={ this.onTyping } placeholder='Paste picture url'/>);
      const followButton = (
        <div className='center-block' style={ { border: '1px solid black', width: 150 } }>
          <button type='button' className='btn btn-success btn-sm' style={ { width: 70 } }>Follow</button>
          <button type='button' className='btn btn-danger btn-sm pull-right' style={ { width: 70 } }>Message</button>
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
                        <div>{ editProfileActive ? editUsername : username }</div>
                        <div>{ editProfileActive ? editBio : bio }</div>
                        <div>{ editProfileActive ? editProfilePic : null }</div>
                      </div>
                    </div>
                  </div>
                  <div className='profile-userbuttons center-block' style={ { border: '1px solid gray' } }>
                    { editProfileActive ? saveChangeButton : followButton }
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
      return null;
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

export default connect(mapStateToProps, { getProfileData, setProfileData, updateProfileData, updateCurrentUser })(UserProfile);
