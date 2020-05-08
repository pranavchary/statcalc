import React from 'react';
import './Header.css';

const Header = (props) => {
  return (
    <div className="header-bar">
      <div className="title-section">
        <div className="title">{ props.title }</div>
        <div className="subtitle">{ props.subtitle }</div>
      </div>
    </div>
  );
}

Header.defaultProps = {
  title: '',
  subtitle: ''
}

export default Header;
