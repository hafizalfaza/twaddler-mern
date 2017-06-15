import React from 'react';
import PropTypes from 'prop-types';

class UserPost extends React.Component {
  render() {
    const { inputText, charCount, alert, onTyping, onPost, isLoading, textInputFocus, textInputBlur, postActive } = this.props;
    return (
      <div onBlur={ textInputBlur }>
        <form onSubmit={ onPost }>
          <div className="form-group">
            <textarea
              className="form-control"
              type="text"
              value={ inputText }
              onChange={ onTyping }
              name="inputText"
              placeholder="Say something..."
              rows="5"
              style={ postActive ? { height: 95 } : { height: 40 } }
              onFocus={ textInputFocus }
            />
            { alert && <span className="text-danger">{ alert }</span> }
          </div>
          <div className="form-group pull-right">
            { charCount }/140
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-md" name="postButton" disabled={ isLoading }>
              Post
            </button>
          </div>
        </form>
      </div>
    );
  }
}

UserPost.propTypes = {
  userPostRequest: PropTypes.func.isRequired,
};

export default UserPost;
