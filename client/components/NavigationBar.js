import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../actions/loginActions';
import { resetReduxState } from '../actions/logoutActions';

// NavBar component
class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      profileData: {},
      searchBarBlank: true,
      username: '',
    };
    this.onChange = this.onChange.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
  }

  componentWillMount() {
    if (this.props.auth.user.user) {
      this.setState({ username: this.props.auth.user.user.username });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateUsername(nextProps);
  }

  updateUsername(nextProps) {
    if (nextProps.auth.user.user) {
      this.setState({ username: nextProps.auth.user.user.username });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value === '') {
      this.setState({ searchBarBlank: true });
    } else {
      this.setState({ searchBarBlank: false });
    }
  }

  logout(e) {
    window.location.reload();
    this.props.logout();
    this.setState({ username: '' });
    this.props.resetReduxState();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const linkToProfile = `/profile/${this.state.username}`;
    const { notifications } = this.props;

    // Conditional rendering constants for navbar
    const userLinks = (
      <ul className='nav navbar-nav navbar-right'>
        <li><Link to = '/' >Home</Link></li>
        <li><Link to = '/user/notifications' >{ notifications.unreadNotifications && this.props.pathname !== '/user/notifications' ? '(' + notifications.unreadNotifications + ')' : null } &nbsp;Notifications </Link></li>
        <li><Link to = { linkToProfile } >Profile</Link></li>
        <li><Link to='/' onClick={ this.logout.bind(this) }>Log Out</Link></li>
      </ul>
    );

    const guestLinks = (
      <ul className='nav navbar-nav navbar-right'>
        <li><Link to='/'>Login</Link></li>
        <li><Link to='/signup'>Signup</Link></li>
      </ul>
    );

    const searchBar = (
      <form className='navbar-form navbar-left'>
        <div className='input-group'>
          <input
            type='text'
            className='form-control'
            name='searchInput'
            placeholder='Search'
            value={ this.state.searchInput }
            onChange={ this.onChange }
          />
          <div className='input-group-btn'>
            <Link to={ `/search/str/${this.state.searchInput}` }><button className='btn btn-default' disabled={ this.state.searchBarBlank }>
              <i className='glyphicon glyphicon-search'></i>
            </button>
            </Link>
          </div>
        </div>
      </form>
    );

    return (
      <nav className='navbar navbar-inverse navbar-static-top' role='navigation'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <Link to='/' className='navbar-brand'>Twaddler</Link>
          </div>
          <div className='collapse navbar-collapse'>
            { searchBar }
            { isAuthenticated ? userLinks : guestLinks }
          </div>
        </div>
      </nav>
    );
  }
}

NavigationBar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

NavigationBar.contextTypes = {
  router: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    notifications: state.notification,
  };
}

export default connect(mapStateToProps, { logout, resetReduxState })(NavigationBar);
