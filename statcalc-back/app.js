const sqlConfig = require('./sqlConfig');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bp = require('body-parser');

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

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
