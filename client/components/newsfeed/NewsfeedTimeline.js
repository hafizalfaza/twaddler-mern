import React from 'react';
import InitialPosts from './timeline/InitialPosts/InitialPosts';

class Dashboard extends React.Component{
	render(){
		const {initialPosts, recentPosts, currentUser} = this.props;
		return(
			<div>
				<InitialPosts initialPosts={initialPosts} currentUser={currentUser} sendNotification={this.props.sendNotification}/>				
			</div>
		);
	}
}

export default Dashboard;