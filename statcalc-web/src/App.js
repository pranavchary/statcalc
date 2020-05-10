import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Header from './common/header/Header';
import Admin from './components/Admin/Admin';
import AddPokemon from './components/Admin/AddPokemon'
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
    <Router>
      <div className="App">
        <Header title="StatCalc" subtitle="for Pokèmon Sword & Shield" />
        <Switch>
          <Route exact path="/" render={ (routeProps) => (
            <StatCalculator
              { ...routeProps }
              statList={ statList }
              natureList={ natureList }
              pokemonList={ pokemonList }
            />
          ) } />
          <Route path="/admin" render={ (routeProps) => <Admin { ...routeProps } /> } />
          <Route path="/addmon" render={ (routeProps) => <AddPokemon { ...routeProps} /> } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
