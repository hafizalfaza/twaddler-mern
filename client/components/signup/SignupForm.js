import React from 'react';
import PropTypes from 'prop-types';
import validateInput from '../../../server/shared/validations/signupValidation';
import TextFieldGroup from '../common/TextFieldGroup';


class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
      isLoading: false,
      invalid: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkUserExists = this.checkUserExists.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  checkUserExists(e) {
    const field = e.target.name;
    const val = e.target.value;
    if (val !== '') {
      this.props.doesUserExist(val).then((res) => {
        const errors = this.state.errors;
        let invalid;
        if (res.data.user[0]) {
          errors[field] = 'This ' + field + ' is already taken';
          invalid = true;
        } else {
          errors[field] = '';
          invalid = false;
        }
        this.setState({ errors, invalid });
      });
    }
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
      this.props.userSignupRequest(this.state).then(
        () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You are now registered, please login',
          });
          this.context.router.history.push('/');
        },
        (err) => { this.setState({ errors: err.response.data, isLoading: false }); },
      );
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <form onSubmit={ this.onSubmit }>
        <h1>Register Now!</h1>
        <TextFieldGroup
          error={ errors.fullName }
          label="Full Name"
          onChange={ this.onChange }
          value={ this.state.fullName }
          field="fullName"
        />

        <TextFieldGroup
          error={ errors.username }
          label="Username"
          onChange={ this.onChange }
          checkUserExists = { this.checkUserExists }
          value={ this.state.username }
          field="username"
        />

        <TextFieldGroup
          error={ errors.email }
          label="Email"
          onChange={ this.onChange }
          checkUserExists = { this.checkUserExists }
          value={ this.state.email }
          field="email"
        />

        <TextFieldGroup
          error={ errors.password }
          label="Password"
          onChange={ this.onChange }
          value={ this.state.password }
          field="password"
          type="password"
        />

        <TextFieldGroup
          error={ errors.passwordConfirmation }
          label="Confirm Password"
          onChange={ this.onChange }
          value={ this.state.passwordConfirmation }
          field="passwordConfirmation"
          type="password"
        />

        <div className="form-group">
          <button className="btn btn-primary btn-md" disabled={ this.state.isLoading || this.state.invalid }>
          Sign Up
          </button>
        </div>
      </form>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  doesUserExist: PropTypes.func.isRequired,
};

SignupForm.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default SignupForm;
