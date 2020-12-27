const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    overwrite: true,
  })
);

//import process.env settings
require('dotenv').config();

const { Pool } = require('pg');
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const PORT = process.env.PORT || 8080;

app.get('/login', (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    db.query(
      `SELECT * FROM users
              WHERE id = $1;`,
      [userId]
    )
      .then((data) => {
        if (data) {
          res.send(data.rows[0]);
        } else {
          res.send(false);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //query user from db
  db.query(
    `SELECT * FROM users
            WHERE email = $1;`,
    [email]
  )
    .then((data) => {
      const hashedPassword = data.rows[0].password;
      const bcryptCheck = bcrypt.compareSync(password, hashedPassword);
      if (bcryptCheck) {
        //set cookie with user id
        req.session.user_id = data.rows[0].id;
        res.send(data.rows[0]);
      } else {
        res.send(false);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.get('/logout', (req, res) => {
  console.log('logout');
  req.session.user_id = null;
  res.send('logout');
});

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
