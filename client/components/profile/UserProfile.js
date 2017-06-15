import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NavigationBar from '../NavigationBar';
import { getProfileData, setProfileData } from '../../actions/profileActions';
import NewsfeedTimeline from '../newsfeed/NewsfeedTimeline';

class UserProfile extends React.Component {
  componentDidMount() {
    const username = this.props.match.params.username;
    this.props.getProfileData(username).then(
      res => this.props.setProfileData(res.data)
    );
  }

  render() {
    const { auth } = this.props;
    const { profileData } = this.props;
    const { userInfo } = profileData;
    const profileSettings = (
      <a href='#'>
        <i className='glyphicon glyphicon-cog'></i>
        Settings
      </a>);
    if (this.props.profileData.userInfo) {
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
                      <h2>{ userInfo.username }</h2>
                    </div>
                    <div className='profile-usertitle-job'>
                      { userInfo.bio }
                    </div>
                  </div>
                  <div className='profile-userbuttons center-block' style={ { border: '1px solid gray' } }>
                    <div className='center-block' style={ { border: '1px solid black', width: 150 } }>
                      <button type='button' className='btn btn-success btn-sm' style={ { width: 70 } }>Follow</button>
                      <button type='button' className='btn btn-danger btn-sm pull-right' style={ { width: 70 } }>Message</button>
                    </div>
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
                        {profileData.userInfo.username === auth.user.user.username ? profileSettings : null}
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

export default connect(mapStateToProps, { getProfileData, setProfileData })(UserProfile);
