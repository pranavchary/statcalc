import React, { useState, useEffect } from 'react';
import Header from './common/header/Header';
import StatCalculator from './components/StatCalculator/StatCalculator';
import { getStatList, getNatureList, getPokemonList } from './common/requests';

import './App.css';

const App = () => {
  const [statList, setStatList] = useState([]);
  const [natureList, setNatureList] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const getInfoAsync = async () => {
      let stats = await getStatList();
      if (stats != null) {
        setStatList(stats);
      }

      let natures = await getNatureList();
      if (natures != null) {
        setNatureList(natures);
      }

      let pokemon = await getPokemonList();
      if (pokemon != null) {
        setPokemonList(pokemon);
      }
    }

    getInfoAsync();
  }, [])

  return (
    <div className="App">
      <Header title="StatCalc" subtitle="for Pokèmon Sword & Shield" />
      <StatCalculator statList={ statList } natureList={ natureList } pokemonList={ pokemonList } />
    </div>
  );
}

export default App;
