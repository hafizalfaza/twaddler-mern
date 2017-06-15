import React from 'react';
import { Link } from 'react-router-dom';

class Comment extends React.Component {
  render() {
    const { comment, date, user } = this.props.comment;
    const profileLink = `/profile/${user}`;

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

    return (
      <div style={ { padding: 5, backgroundColor: '#E3ECF3', border: '1px solid #CAE9FF', fontSize: 12 } }>
        <span style={ { fontWeight: 'bold' } }><Link to={ profileLink }>{ user }</Link></span>&nbsp;&nbsp;{ comment }
        <span className='pull-right' style={ { fontSize: 12, color: 'gray' } }>{ second >= 1 && minute < 1 ? secondStatement : minute >= 1 && hour < 1 ? minuteStatement : hour >= 1 && day < 1 ? hourStatement : day >= 1 && week < 1 ? dayStatement : recentStatement }</span>
      </div>
    );
  }
}

export default Comment;
