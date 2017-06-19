import React from 'react';
import InitialPosts from './timeline/InitialPosts/InitialPosts';

class Dashboard extends React.Component {
  render() {
    const { initialPosts, recentPosts, currentUser } = this.props;
    if (initialPosts.length === 0) {
      return (<div className='text-center' ><h1 style={ { color: 'gray' } }>No Post</h1></div>);
    } else {
      return (
        <div>
          <InitialPosts initialPosts={ initialPosts } currentUser={ currentUser } sendNotification={ this.props.sendNotification } profileRoute={ this.props.profileRoute }/>
        </div>
      );
    }
  }
}

export default Dashboard;
