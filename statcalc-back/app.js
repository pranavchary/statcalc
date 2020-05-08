const sqlConfig = require('./sqlConfig');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bp = require('body-parser');

const Nature = require('./classes/Nature');
const Pokemon = require('./classes/Pokemon');

const app = express();
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json());
app.use(cors());

const conn = mysql.createConnection(sqlConfig);

conn.connect(err => {
  if (err)
    throw err;
  console.log('Connected successfully');
});

app.get('/StatNames', (req, res) => {
  conn.query('CALL GetStats()', (err, rows) => {
    if (err)
      throw err;
    let stats = [];
    if (rows.length >= 1) {
      let data = rows[0];
      for (let i in data) {
        stats.push(data[i].Name);
      }
    }
    res.send(stats);
  });
});

app.get('/Natures', (req, res) => {
  conn.query('CALL GetNatures()', (err, rows) => {
    if (err)
      throw err;
    let natures = [];
    if (rows.length >= 1) {
      let data = rows[0];
      for (let i in data) {
        natures.push(new Nature(data[i].NatureID, data[i].NatureName, data[i].HinderStatID, data[i].BoostStatID));
      }
    }
    res.send(natures);
  });
});

app.get('/Pokemon', (req, res) => {
  conn.query('CALL GetPokemon()', (err, rows) => {
    if (err)
      throw err;
    let pokemon = [];
    if (rows.length >= 1) {
      let data = rows[0];
      for (let i in data) {
        pokemon.push(new Pokemon(
          data[i].PokemonID,
          data[i].NatDexNumber,
          data[i].Name,
          data[i].HP,
          data[i].Atk,
          data[i].Def,
          data[i].SpAtk,
          data[i].SpDef,
          data[i].Spd,
          data[i].ImageID
        ));
      }
    }
    res.send(pokemon);
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
