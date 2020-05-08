import React from 'react';
import TextInput from '../input/TextInput';
import './StatGroup.css';

const StatGroup = (props) => {
  const renderGroup = () => {
    let statArray = [];
    for (let i in props.statsObject) {
      statArray.push({ key: i, value: props.statsObject[i] });
    }
    return statArray.map((stat, i) => {
      return (
        <TextInput
          key={ stat.key }
          maxLength={3}
          id={ `${ props.groupTitle }${ stat.key }` }
          label={ props.labels[i] }
          type="text"
          name={ stat.key }
          defaultValue={ stat.value.toString() }
          onChange={ (event) => props.onChange(event) }
          onBlur={ (event) => props.onBlur(event) }
        />
      )
    });
  }

  return (
    <div className="stat-group">
      <div className="stat-group-title">{props.groupTitle}</div>
      <div className="stat-container">
        { renderGroup() }
      </div>
    </div>
  );
}

StatGroup.defaultProps = {
  labels: [],
  statsObject: { },
  onChange: () => { },
  onBlur: () => { },
  groupTitle: ''
}

export default StatGroup;
