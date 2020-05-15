const config = require('./config');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bp = require('body-parser');
const imgDownload = require('image-downloader');

const Stat = require('./classes/Stat');
const Nature = require('./classes/Nature');
const Pokemon = require('./classes/Pokemon');

const app = express();
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json());
app.use(cors());

const conn = mysql.createConnection(config.sqlConfig);

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
        stats.push(new Stat(data[i].StatID, data[i].Name, data[i].Abbr));
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

app.post('/LoginAdmin', (req, res) => {
  let sql = 'CALL LoginAdmin(?);';
  let values = [req.body.username];
  let options = { sql, values };
  conn.query(options, (err, rows) => {
    if (err)
      throw err;
    if (rows.length >= 1) {
       let data = rows[0][0];
       res.send(data.UserExists === 1);
    } else {
      res.send(false);
    }
  });
});

app.post('/AddPokemon', async (req, res) => {
  let responseObject = { imageSaved: false, shinyImageSaved: false, dataSaved: false };
  let imgOptions = {
    url: `${ config.imageBaseUrl }/${ req.body.natDexNumber }.png`,
    dest: `${ config.pokemonImagePath }/${ req.body.natDexNumber }.png`
  }
  imgDownload.image(imgOptions)
  .then(async () => {
    responseObject.imageSaved = true;
    let shinyOptions = {
      url: `${ config.shinyBaseUrl }/${req.body.natDexNumber}.png`,
      dest: `${ config.pokemonImagePath }/S${ req.body.natDexNumber }.png`
    }
    await imgDownload.image(shinyOptions)
    .then(() => {
      console.log('shiny saved');
      responseObject.shinyImageSaved = true;
    })
    .catch(err => { });
    let sql = 'CALL AddPokemon(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    let { natDexNumber, galarDexNumber, name, hp, atk, def, spAtk, spDef, spd } = req.body;
    let values = [natDexNumber, galarDexNumber, name, hp, atk, def, spAtk, spDef, spd];
    let options = { sql, values };
    await conn.query(options, (err, rows) => {
      if (err)
        throw err;
      if (rows.affectedRows === 1) {
        console.log('data saved');
        responseObject.dataSaved = true;
      }
      console.log('responseObject', responseObject);
      res.send(responseObject);
    });
  })
  .catch(err => res.send(responseObject));
});

app.listen(config.port, () => {
  console.log(`Server running on port ${ config.port }`);
});
