import React from 'react';
import InitialPost from './InitialPost';
import PropTypes from 'prop-types';

class InitialPosts extends React.Component {
  render() {
    if (this.props.initialPosts) {
      const initialPosts = this.props.initialPosts.map(initialPost =>
        <InitialPost key={ initialPost._id } initialPost={ initialPost } comments={ initialPost.comments } sendNotification={ this.props.sendNotification } profileRoute={ this.props.profileRoute }/>
      );
      return (
        <div>
          { initialPosts }
        </div>
      );
    } else {
      return false;
    }
  }
}

export default InitialPosts;
