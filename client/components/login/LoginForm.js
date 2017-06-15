import React from 'react';
import TextFieldGroup from '../common/TextFieldGroup';
import validateInput from '../../../server/shared/validations/loginValidation';
import { connect } from 'react-redux';
import { userLoginRequest } from '../../actions/loginActions';
import PropTypes from 'prop-types';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      password: '',
      errors: {},
      isLoading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.userLoginRequest(this.state).then(
        (res) => {
          this.context.router.history.push('/');
        }
      ).then(() => this.props.receiveNotifications())
        .catch((err) => { this.setState({ errors: err.response.data.errors, isLoading: false }); });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, identifier, password, isLoading } = this.state;
    return (
      <form onSubmit={ this.onSubmit }>
        <h1>Twaddler</h1>
        {errors.form && <div className='alert alert-danger'>{ errors.form }</div>}
        <TextFieldGroup
          error={errors.identifier}
          label='Username or email'
          onChange={ this.onChange }
          value={ this.state.identifier }
          field='identifier'
        />

        <TextFieldGroup
          error={ errors.password }
          label='Password'
          onChange={ this.onChange }
          value={ this.state.password }
          field='password'
          type='password'
        />
        <div className='form-group'>
          <button className='btn btn-primary btn-md' disabled={ this.state.isLoading || this.state.invalid }>
            Log In
          </button>
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  userLoginRequest: PropTypes.func.isRequired,
};

LoginForm.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default connect(null, { userLoginRequest })(LoginForm);

