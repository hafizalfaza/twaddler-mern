import PropTypes from 'prop-types';
import classnames from 'classnames';
import React from 'react';

const TextFieldGroup = ({ field, value, label, error, type, onChange, checkUserExists }) => {
  return (
    <div className={ classnames('form-group', { 'has-error': error }) }>
      <label className='control-label'>{label}</label>
      <input
        onChange={ onChange }
        onBlur={ checkUserExists }
        value={ value }
        type={ type }
        name={ field }
        className="form-control"
      />
      { error && <span className="help-block">{ error }</span> }
    </div>
  );
};

TextFieldGroup.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checkUserExists: PropTypes.func,
};

TextFieldGroup.defaultProps = {
  type: 'text',
};

export default TextFieldGroup;
