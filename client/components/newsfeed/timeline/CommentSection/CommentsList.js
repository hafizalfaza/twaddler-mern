import React from 'react';
import Comment from './Comment';

class CommentsList extends React.Component {
  render() {
    if (this.props.comments) {
      const comments = this.props.comments.map(comment =>
        <Comment key={ comment.commentId } comment={ comment } postHover={ this.props.postHover }/>
      );
      return (
        <div >
          { comments }
        </div>
      );
    } else {
      return null;
    }
  }
}

export default CommentsList;
