import React from 'react';
import './Button.css';

const Button = (props) => {

  return (
    <div
      className="button"
      style={ props.buttonStyles }
      onClick={ (event) => props.onClick(event) }
    >
      <div className="button-text" style={ props.textStyles }>{ props.text }</div>
    </div>
  );
}

Button.defaultProps = {
  buttonStyles: { },
  onClick: () => { },
  textStyles: { },
  text: ''
}

export default Button;
