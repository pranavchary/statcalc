import React from 'react';

import './Input.css';

const onKeyPress = (event, props) => {
  if (event.key === "Enter")
    props.onEnter();
}

const TextInput = (props) => {
  return (
    <div
      className="input-container"
      style={{
        width: props.width,
        height: props.height
      }}
    >
      <input
        type={props.type}
        maxLength={ props.maxLength }
        className="text-input"
        name={props.name}
        id={props.id}
        readOnly={props.readOnly}
        value={props.defaultValue}
        onChange={ (event) => props.onChange(event) }
        onFocus={ (event) => props.onFocus(event) }
        onBlur={ (event) => props.onBlur(event) }
        onKeyPress={ (event) => onKeyPress(event, props) }
        autoFocus={props.autoFocus}
      />
      <label className="text-input-label" htmlFor={props.id}>{ props.label}</label>
    </div>
  );
}

TextInput.defaultProps = {
  autoFocus: false,
  type: 'text',
  width: '100px',
  height: '25px',
  maxLength: 100,
  name: 'input',
  readOnly: false,
  label: '',
  defaultValue: '',
  onChange: () => { },
  onFocus: () => { },
  onBlur: () => { },
  onEnter: () => { },
}

export default TextInput;
