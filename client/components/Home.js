import React from 'react';
import NewsfeedComponents from './newsfeed/NewsfeedComponents';


class Home extends React.Component {
  render() {
    return (
      <div>
        <NewsfeedComponents sendNotification={ this.props.sendNotification }/>
      </div>
    );
  }
}

export default Home;
