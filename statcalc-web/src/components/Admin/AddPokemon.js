import React, { useState, useReducer } from 'react';
import TextInput from '../../common/input/TextInput';
import StatGroup from '../../common/statGroup/StatGroup';
import Button from '../../common/button/Button';
import Loading from '../../common/loading/Loading';
import { addPokemon } from '../../common/requests';

import './AddPokemon.css';

const AddPokemon = (props) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const reducer = (state, action) => {
    let { type, payload } = action;
    switch (type) {
      case 'reset':
        return { ...state, ...payload }
      default:
        return { ...state, [type]: payload }
    }
  }

  const [pokemonInfo, dispatchPokemonInfo] = useReducer(reducer, {
    natDexNumber: '',
    galarDexNumber: '',
    name: '',
  });

  const [baseStats, dispatchBaseStats] = useReducer(reducer, {
    hp: 0,
    atk: 0,
    def: 0,
    spAtk: 0,
    spDef: 0,
    spd: 0
  });

  const handleInfoChange = (event) => {
    let type = event.target.name;
    let payload = event.target.value;
    if (type.toLowerCase().includes('number')) {
      payload = parseInt(payload.replace(/[^0-9]/gi, ''), 10);
      if (isNaN(payload)) {
        payload = '';
      }
    }
    dispatchPokemonInfo({ type, payload });
  }

  const handleStatChange = (event) => {
    event.preventDefault();
    let value = event.target.value.replace(/[^0-9]/gi, '');
    let intValue = parseInt(value, 10);
    if (!isNaN(intValue)) {
      dispatchBaseStats({ type: event.target.name, payload: intValue });
    } else {
      dispatchBaseStats({ type: event.target.name, payload: '' });
    }
  }

  const handleStatBlur = (event) => {
    event.preventDefault();
    if (event.target.value === '0' || event.target.value === '') {
      dispatchBaseStats({ type: event.target.name, payload: 0 });
    }
  }

  const handleSubmit = async () => {
    await setLoading(true);
    let textFieldsPopulated = (Object.values(pokemonInfo).filter(i => i.toString().trim() === '')).length === 0;
    let statFieldsPopulated = (Object.values(baseStats).filter(s => s === 0)).length === 0;
    if (textFieldsPopulated && statFieldsPopulated) {
      let result = await addPokemon({ ...pokemonInfo, ...baseStats });
      console.log(result);
      if (result) {
        if (!result.imageSaved) {
          setErrorMsg('Unable to save Pokémon: Image was not saved successfully.');
        } else if (result.imageSaved && !result.dataSaved) {
          setErrorMsg('Unable to save Pokémon: Image was saved, but data was not saved successfully.');
        } else {
          await setLoading(false);
          setErrorMsg(!result.shinyImageSaved ? 'Pokémon was saved, but shiny image could not be found.' : '');
        }
      } else {
        setErrorMsg('Error: exception caught in request.');
      }
    } else {
      setErrorMsg('All fields must be properly populated.');
    }
  }

  return (
    <div className="add-mon-container">
      { loading && <Loading /> }
      <h2>Add Pokemon</h2>
      <div className="add-mon-subtitle">
        If Pokémon does not exist in the Galar Pokédex, that field can be left blank.
      </div>
      <div>
        <TextInput
          autoFocus={true}
          id="natDexNumber"
          maxLength={3}
          label="National Dex #"
          type="text"
          name="natDexNumber"
          defaultValue={ pokemonInfo.natDexNumber }
          onChange={ (event) => handleInfoChange(event) }
        />
        <TextInput
          id="galarDexNumber"
          maxLength={3}
          label="Galar Dex #"
          type="text"
          name="galarDexNumber"
          defaultValue={ pokemonInfo.galarDexNumber }
          onChange={ (event) => handleInfoChange(event) }
        />
        <TextInput
          id="name"
          maxLength={ 50 }
          label="Pokemon Name"
          type="text"
          name="name"
          defaultValue={ pokemonInfo.name }
          onChange={ (event) => handleInfoChange(event) }
          width="200px"
        />
      </div>
      <StatGroup
        groupTitle="Base Stats"
        labels={ ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp.Def', 'Speed'] }
        statsObject={ baseStats }
        onChange={ (event) => handleStatChange(event) }
        onBlur={ (event) => handleStatBlur(event) }
      />
      <div className="error-msg">{ errorMsg }</div>
      <Button text="Create" onClick={ () => handleSubmit() } />
    </div>
  );
}

export default AddPokemon;
