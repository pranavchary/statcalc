import React, { useState, useReducer, useEffect } from 'react';
import StatGroup from '../../common/statGroup/StatGroup';
import TextInput from '../../common/input/TextInput';
import SelectInput from '../../common/input/SelectInput';
import Button from '../../common/button/Button';

import PokemonImages from '../../assets/pokemon-images/index';

import './StatCalculator.css';

const StatCalculator = (props) => {
  const [level, setLevel] = useState('');
  const [natureOptions, setNatureOptions] = useState([]);
  const [pokemonOptions, setPokemonOptions] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState({ imageID: 'NOIMG', name: 'None Selected' });
  const [selectedNature, setSelectedNature] = useState({ });
  const [showCalcStats, setShowCalcStats] = useState(false);
  const reducer = (state, action) => {
    if (action.type === 'allBaseStats') {
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

  useEffect(() => {
    let natures = [];
    let pokemon = [];
    for (let i in props.natureList) {
      natures.push(props.natureList[i].name);
    }
    for(let i in props.pokemonList) {
      pokemon.push(props.pokemonList[i].name);
    }
    setNatureOptions(natures);
    setPokemonOptions(pokemon);
  }, [props.natureList, props.pokemonList]);

  const hpCalc = (base, iv, ev, level) => {
    let doubleBaseStat = base * 2;
    let evDivFour = ev / 4;
    let levelDivHundred = level / 100;
    let floatStat = ((doubleBaseStat + iv + evDivFour) * levelDivHundred) + level + 10
    return (Math.floor(floatStat));
  }

  const handlePokemonSelect = (option) => {
    let pokemon = props.pokemonList.find(p => p.name == option);
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <SelectInput
        width="250px"
        options={ pokemonOptions }
        onSelect={ (option) => handlePokemonSelect(option) }
        selectTitle="pokemon"
        selectName="pokemon"
      />
      <div className="pkmn-img-container">
        <img
          className={ selectedPokemon.pokemonID == null ? 'pkmn-img no-pkmn-select' : 'pkmn-img' }
          src={ PokemonImages[selectedPokemon.imageID] }
          alt={ selectedPokemon.name}
        />
      </div>
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
          options={ natureOptions }
          onSelect={ (option) => handleNatureSelect(option) }
          selectTitle="nature"
          selectName="natures"
        />
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
        <TextInput
          id="calcHp"
          label="HP"
          type="text"
          name="calcHp"
          defaultValue={ calcStats.hp }
          readonly={true}
        />
      )}
    </div>
  );
}

export default StatCalculator;
