import React, { useState, useReducer, useEffect } from 'react';
import StatGroup from '../../common/statGroup/StatGroup';
import SwitchInput from '../../common/input/SwitchInput';
import TextInput from '../../common/input/TextInput';
import SelectInput from '../../common/input/SelectInput';
import Button from '../../common/button/Button';

import PokemonImages from '../../assets/pokemon-images/index';

import './StatCalculator.css';

const StatCalculator = (props) => {
  const [level, setLevel] = useState('');
  const [showShiny, setShowShiny] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState({ imageID: 'NOIMG', name: 'None Selected' });
  const [selectedNature, setSelectedNature] = useState({ });
  const [showCalcStats, setShowCalcStats] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const reducer = (state, action) => {
    if (action.type === 'allStats') {
      return {
        hp: action.payload.hp,
        atk: action.payload.atk,
        def: action.payload.def,
        spAtk: action.payload.spAtk,
        spDef: action.payload.spDef,
        spd: action.payload.spd
      }
    } else {
      return { ...state, [action.type]: action.payload }
    }
  }

  const [baseStats, dispatchBaseStats] = useReducer(reducer, {
    hp: '',
    atk: '',
    def: '',
    spAtk: '',
    spDef: '',
    spd: ''
  });

  const [indiValues, dispatchIndiValues] = useReducer(reducer, {
    hp: 0,
    atk: 0,
    def: 0,
    spAtk: 0,
    spDef: 0,
    spd: 0
  });

  const [effValues, dispatchEffValues] = useReducer(reducer, {
    hp: 0,
    atk: 0,
    def: 0,
    spAtk: 0,
    spDef: 0,
    spd: 0
  });

  const [calcStats, dispatchCalcStats] = useReducer(reducer, {

    hp: '',
    atk: '',
    def: '',
    spAtk: '',
    spDef: '',
    spd: ''
  });

  useEffect(() => {
    if (selectedPokemon.pokemonID != null) {
      dispatchBaseStats({ type: 'allStats', payload: selectedPokemon.stats });
    }
  }, [selectedPokemon]);

  const validateAllValues = () => {
    let errorString = '';
    const getIntStat = (stat) => {
      if (stat === '') {
        return 0;
      } else if (typeof stat === 'string') {
        return parseInt(stat, 10);
      } else {
        return stat;
      }
    }

    // pokemon
    if (selectedPokemon.pokemonID == null) {
      setErrorMsg('Please select a Pokemon');
      return false;
    }

    // level
    let lStat = getIntStat(level);
    if (lStat > 100 || lStat < 1) {
      setErrorMsg('Level must be between 1 and 100')
      return false;
    }

    // nature
    if (Object.keys(selectedNature).length === 0) {
      setErrorMsg('Please select a nature');
      return false;
    }

    // check IVs
    for (let i in indiValues) {
      let iStat = getIntStat(indiValues[i]);
      if (iStat > 31) {
        errorString += 'IVs cannot have a value greater than 31.';
        break;
      }
    }

    // check EVs
    let effortTotal = 0;
    for (let i in effValues) {
      let eStat  = getIntStat(effValues[i]);
      if (effortTotal > 510) {
        errorString += 'Total of all EVs cannot exceed 510.';
        break;
      } else if (eStat > 255) {
        errorString += 'EVs cannot have a value greater than 255.'
        break;
      } else {
        effortTotal += eStat;
      }
    }

    setErrorMsg(errorString);
    return errorString === '';
  }

  const calculateHp = (base, iv, ev, level) => {
    let doubleBaseStat = base * 2;
    let evDivFour = ev / 4;
    let levelDivHundred = level / 100;
    let floatStat = ((doubleBaseStat + iv + evDivFour) * levelDivHundred) + level + 10
    return Math.floor(floatStat);
  }

  const calculateStat = (base, iv, ev, level, nature = 1) => {
    let doubleBaseStat = base * 2;
    let evDivFour = ev / 4;
    let levelDivHundred = level / 100;
    let floatStat = (((doubleBaseStat + iv + evDivFour) * levelDivHundred) + 5) * nature;
    return Math.floor(floatStat);
  }

  const handlePokemonSelect = (option) => {
    let pokemon = props.pokemonList.find(p => p.name === option);
    setSelectedPokemon(pokemon);
  }

  const handleNatureSelect = (option) => {
    let nature = props.natureList.find(n => n.name === option);
    setSelectedNature(nature);
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
    if (event.target.value === '0' || event.target.value === '') {
      dispatchFunction({ type: event.target.name, payload: 0 });
    }
  }

  const handleLevelBlur = (event) => {
    event.preventDefault();
    if (event.target.value === '0') {
      setLevel('');
    }
  }

  const handleSubmit = () => {
    if (validateAllValues()) {
      let boost = selectedNature.boostStatID !== 0 ? props.statList.find(s => s.statID === selectedNature.boostStatID).abbr : '';
      let hinder = selectedNature.hinderStatID !== 0 ? props.statList.find(s => s.statID === selectedNature.hinderStatID).abbr : '';
      let calculated = { }
      for (let i in baseStats) {
        if (i === 'hp') {
          calculated.hp = calculateHp(baseStats.hp, indiValues.hp, effValues.hp, level);
        } else if (i === boost) {
          calculated[i] = calculateStat(baseStats[i], indiValues[i], effValues[i], level, 1.1);
        } else if (i === hinder) {
          calculated[i] = calculateStat(baseStats[i], indiValues[i], effValues[i], level, 0.9);
        } else {
          calculated[i] = calculateStat(baseStats[i], indiValues[i], effValues[i], level);
        }
      }
      dispatchCalcStats({ type: 'allStats', payload: calculated });
      setShowCalcStats(true);
    }
  }

  const pokemonImage = () => {
    let prefix = '';
    if (selectedPokemon.pokemonID != null && showShiny) {
      prefix = 'S';
    }

    return prefix + selectedPokemon.imageID;
  }

  return (
    <div className="stat-calculator">
    <div className="stat-calculator-head">
    <div className="pokemon-selection">
      <SelectInput
        width="250px"
        options={ props.pokemonList.map(p => p.name) }
        onSelect={ (option) => handlePokemonSelect(option) }
        selectTitle="pokemon"
        selectName="pokemon"
      />
      <div className="pkmn-img-container">
        <img
          className={ selectedPokemon.pokemonID == null ? 'pkmn-img no-pkmn-select' : 'pkmn-img' }
          src={ PokemonImages[pokemonImage()] }
          alt={ selectedPokemon.name}
        />
      </div>
      </div>
      <SwitchInput
        labelText="Shiny Form"
        name="showShiny"
        id="showShiny"
        onClick={ (value) => setShowShiny(value) }
      />
    </div>
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
        <SelectInput
          options={ props.natureList.map(n => n.name) }
          onSelect={ (option) => handleNatureSelect(option) }
          selectTitle="nature"
          selectName="natures"
        />
      </div>
      <StatGroup
        groupTitle="Base Stats"
        labels={ props.statList.map(s => s.name) }
        statsObject={ baseStats }
      />
      <StatGroup
        groupTitle="IVs"
        labels={ props.statList.map(s => s.name) }
        statsObject={ indiValues }
        onChange={ (event) => handleStatChange(event, dispatchIndiValues) }
        onBlur={ (event) => handleStatBlur(event, dispatchIndiValues) }
      />
      <StatGroup
        groupTitle="EVs"
        labels={ props.statList.map(s => s.name) }
        statsObject={ effValues }
        onChange={ (event) => handleStatChange(event, dispatchEffValues) }
        onBlur={ (event) => handleStatBlur(event, dispatchEffValues) }
      />
      <Button buttonStyles={{ margin: '10px' }} text="Calculate" onClick={ () => handleSubmit() } />
      {
        showCalcStats && errorMsg === '' ? (
          <StatGroup
            groupTitle="Calculated Stats"
            labels={ props.statList.map(s => s.name) }
            statsObject={ calcStats }
          />
        ) : <div className="error-msg">{ errorMsg }</div>
      }
    </div>
  );
}

export default StatCalculator;
