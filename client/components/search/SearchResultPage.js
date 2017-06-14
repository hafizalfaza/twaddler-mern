import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {followRequest} from '../../actions/followActions';
import SearchResult from './SearchResult';
import NavigationBar from '../NavigationBar';

class SearchResultPage extends React.Component{
	constructor(props, context){
		super(props, context);
		this.state = {
			requestedUser: '',
			errors: {}
		}
	}
	
	render(){
		const searchResultData = this.props.searchResultData.map(eachData =>
			<SearchResult key={eachData.id} eachData={eachData} />
		);
		return(
			<div className="container-fluid">
				<div className="row">
					<NavigationBar />
				</div>
				
				 <div className="container"> 
					<div className="col-md-4 col-md-offset-4">
						{searchResultData ? searchResultData : "No Result"}
					</div>				
				 </div>				
			</div>
		
		
			
		);
	}
}

SearchResultPage.propTypes = {
	searchResultData: PropTypes.array
}

function mapStateToProps(state){
	return {
		searchResultData: state.search
	}
}


export default connect(mapStateToProps, {followRequest})(SearchResultPage);