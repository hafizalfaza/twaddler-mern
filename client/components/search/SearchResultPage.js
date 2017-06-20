import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { followRequest } from '../../actions/followActions';
import SearchResult from './SearchResult';
import NavigationBar from '../NavigationBar';
import { search, fetchSearchResult, resetSearchState } from '../../actions/searchActions';

class SearchResultPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      requestedUser: '',
      errors: {},
    };
  }

  componentWillMount() {
    this.props.resetSearchState();
    this.props.search(this.props.match.params.searchQuery).then(
      (res) => {
        if (res.data.user) {
          const { _id, fullName, username, bio, following, followers, profilePic } = res.data.user;
          this.props.fetchSearchResult({
            id: _id,
            fullName,
            username,
            bio,
            profilePic,
            following,
            followers,
          });
        }
      },
      (err) => { this.setState({ errors: err.response.data }); },
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.searchQuery !== this.props.match.params.searchQuery) {
      this.props.resetSearchState();
      this.props.search(nextProps.match.params.searchQuery).then(
        (res) => {
          if (res.data.user) {
            const { _id, fullName, username, bio, following, followers, profilePic } = res.data.user;
            this.props.fetchSearchResult({
              id: _id,
              fullName,
              username,
              bio,
              profilePic,
              following,
              followers,
            });
          }
        },
        (err) => { this.setState({ errors: err.response.data }); },
      );
    }
  }

  render() {
    const searchResultData = this.props.searchResultData.map(eachData =>
      <SearchResult key={ eachData.id } eachData={ eachData } />
    );
    console.log(this.props.searchResultData);
    return (
      <div className="container-fluid">
        <div className="row">
          <NavigationBar />
        </div>
        <div className="container">
          <div className="col-md-4 col-md-offset-4">
            { searchResultData ? searchResultData : <span>No result</span> }
          </div>
        </div>
      </div>
    );
  }
}

SearchResultPage.propTypes = {
  searchResultData: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    searchResultData: state.search,
  };
}


export default connect(mapStateToProps, { followRequest, search, fetchSearchResult, resetSearchState, })(SearchResultPage);
