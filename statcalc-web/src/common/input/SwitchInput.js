import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './Input.css';

const SwitchInput = (props) => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    if (props.onClick) {
      props.onClick(value);
    }
  }, [value]);

  return (
    <div className="switchinput-container">
      <label className="switchinput-label">{ props.labelText }</label>
      <div className="switchinput-switch">
        <input
          type="checkbox"
          className={ props.className ? `switchinput ${ props.className }` : "switchinput" }
          name={ props.name }
          id={ props.id }
          onClick={ (e) => setValue(e.target.value === "false") }
          value={ value }
          />
        <label htmlFor={ props.id } className="switchinput-slider"></label>
      </div>
    </div>
  )
}

SwitchInput.defaultProps = {
  labelText: '',
  className: '',
  name: 'checkbox',
  id: 'checkbox',
  onClick: () => { }
}

SwitchInput.propTypes = {
  labelText: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func
}

export default SwitchInput;
