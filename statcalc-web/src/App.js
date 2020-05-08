import React, { useState, useEffect } from 'react';
import Header from './common/header/Header';
import StatCalculator from './components/StatCalculator/StatCalculator';
import { getStatList } from './common/requests';

import './App.css';

const App = () => {
  const [statList, setStatList] = useState([]);
  const [natureList, setNatureList] = useState([]);

  useEffect(() => {
    const getStatsAsync = async () => {
      let values = await getStatList();
      if (values != null) {
        setStatList(values);
      }
    }

    getStatsAsync();
  }, [])

  return (
    <div className="App">
      <Header title="StatCalc" subtitle="for Pokèmon Sword & Shield" />
      <StatCalculator statList={ statList } />
    </div>
  );
}

export default App;
