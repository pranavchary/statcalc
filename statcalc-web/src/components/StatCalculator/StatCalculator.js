import React, { useState, useReducer } from 'react';
import StatGroup from '../../common/statGroup/StatGroup';
import TextInput from '../../common/input/TextInput';
import SelectInput from '../../common/input/SelectInput';
import Button from '../../common/button/Button';

const StatCalculator = (props) => {
  const [level, setLevel] = useState('');
  const [showCalcStats, setShowCalcStats] = useState(false);
  const reducer = (state, action) => {
    return { ...state, [action.type]: action.payload }
  }
  const options = ["Value1", "Value2", "Value3", "value4", "Value5"];

  const [baseStats, dispatchBaseStats] = useReducer(reducer, {
    hp: '',
    atk: '',
    def: '',
    spAtk: '',
    spDef: '',
    spd: ''
  });

  const [indiValues, dispatchIndiValues] = useReducer(reducer, {
    hp: '',
    atk: '',
    def: '',
    spAtk: '',
    spDef: '',
    spd: ''
  });

  const [effValues, dispatchEffValues] = useReducer(reducer, {
    hp: '',
    atk: '',
    def: '',
    spAtk: '',
    spDef: '',
    spd: ''
  });

  const [calcStats, dispatchCalcStats] = useReducer(reducer, {

    hp: '',
    atk: '',
    def: '',
    spAtk: '',
    spDef: '',
    spd: ''
  });

  const hpCalc = (base, iv, ev, level) => {
    let doubleBaseStat = base * 2;
    let evDivFour = ev / 4;
    let levelDivHundred = level / 100;
    let floatStat = ((doubleBaseStat + iv + evDivFour) * levelDivHundred) + level + 10
    return (Math.floor(floatStat));
  }

  const handleStatChange = (event, dispatchFunction) => {
    event.preventDefault();
    let value = event.target.value.replace(/[^0-9]/gi, '');
    let intValue = parseInt(value, 10);
    if (!isNaN(intValue)) {
      dispatchFunction({ type: event.target.name, payload: intValue });
    } else {
      dispatchFunction({ type: event.target.name, payload: '' });
    }
  }

  const handleLevelChange = (event) => {
    event.preventDefault();
    let value = event.target.value.replace(/[^0-9]/gi, '');
    let intValue = parseInt(value, 10);
    if (!isNaN(intValue)) {
      setLevel(intValue);
    } else {
      setLevel('');
    }
  }

  const handleStatBlur = (event, dispatchFunction) => {
    event.preventDefault();
    if (event.target.value === '0') {
      dispatchFunction({ type: event.target.name, payload: '' });
    }
  }

  const handleLevelBlur = (event) => {
    event.preventDefault();
    if (event.target.value === '0') {
      setLevel('');
    }
  }

  const handleSubmit = () => {
    dispatchCalcStats({ type: 'hp', payload: hpCalc(baseStats.hp, indiValues.hp, effValues.hp, level) });
    setShowCalcStats(true);
  }
  return (
    <div className="stat-calculator">
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextInput
          id="level"
          maxLength={3}
          label="Level"
          type="text"
          name="level"
          defaultValue={ level.toString() }
          onChange={ (event) => handleLevelChange(event) }
          onBlur={ (event) => handleLevelBlur(event) }
        />
        <SelectInput options={ options } selectTitle="nature" selectName="natures" />
      </div>
      <StatGroup
        groupTitle="Base Stats"
        labels={ props.statList }
        statsObject={ baseStats }
        onChange={ (event) => handleStatChange(event, dispatchBaseStats) }
        onBlur={ (event) => handleStatBlur(event, dispatchBaseStats) }
      />
      <StatGroup
        groupTitle="IVs"
        labels={ props.statList }
        statsObject={ indiValues }
        onChange={ (event) => handleStatChange(event, dispatchIndiValues) }
        onBlur={ (event) => handleStatBlur(event, dispatchIndiValues) }
      />
      <StatGroup
      groupTitle="EVs"
        labels={ props.statList }
        statsObject={ effValues }
        onChange={ (event) => handleStatChange(event, dispatchEffValues) }
        onBlur={ (event) => handleStatBlur(event, dispatchEffValues) }
      />
      <Button text="Calculate" onClick={ () => handleSubmit() } />
      { showCalcStats && (
        <div>{ calcStats.hp }</div>
      )}
    </div>
  );
}

export default StatCalculator;
