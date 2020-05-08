import React, { useState, useEffect } from 'react';
import './Input.css';

const SelectOption = (props) => {
  return (
    <div className="select-option" id={ props.value } onClick={ (event) => props.onClick(event) }>
      { props.value }
    </div>
  )
}

const SelectInput = (props) => {
  const [opened, setOpened] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [selected, setSelected] = useState('');
  const dropdownMaxHeight = 100

  useEffect(() => {
    if (opened && dropdownHeight < dropdownMaxHeight) {
      setTimeout(() => { setDropdownHeight(dropdownHeight + 1) }, 1);
    } else if (!opened && dropdownHeight > 0) {
      setTimeout(() => { setDropdownHeight(dropdownHeight - 1) }, 1);
    } else {
      clearTimeout();
    }
  });

  const handleSelection = (option) => {
    setSelected(option);
    setOpened(false);
    props.onSelect(option);
  }

  const renderOptions = () => {
    return props.options.map((option, i) => {
      return (
        <SelectOption key={props.selectName + i} value={ option } onClick={ () => handleSelection(option) } />
      )
    })
  }

  return (
    <div className="select-input-container">
      <div className="select-input-title">{ props.selectTitle || props.selectName }</div>
      <div
        className="select-input"
        style={{
          width: props.width,
          height: props.height,
          borderBottomLeftRadius: opened ? 0 : undefined
        }}>
        <div className="selected-value">
          { selected }
          <div className="option-list" style={{
            top: props.height,
            height: `${ dropdownHeight }px`,
            borderBottom: opened ? undefined : 'none',
            borderTop: opened ? undefined : 'none'
          }}>
            { renderOptions() }
          </div>
        </div>
        <div className={ opened ? "arrow opened" : "arrow" } onClick={ () => setOpened(!opened) }></div>
      </div>
    </div>
  );
}

SelectInput.defaultProps = {
  selectTitle: 'Select',
  width: '150px',
  height: '25px',
  onSelect: () => { }
}

export default SelectInput;
