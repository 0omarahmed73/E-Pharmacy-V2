const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT;
app.use(express.json())
app.use(cors());

app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const data = await fs.readFile(path.join(__dirname, './users.json'), 'utf8');
    const usersObj = JSON.parse(data);
    const users = usersObj.users;
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      res.status(200).json(user);
      console.log(user);
    } else {
      res.status(404).json({ message: "الرجاء التأكد من البريد الالكتروني وكلمة المرور" });
    }
  } catch (err) {
    res.status(500).json({ message: "الرجاء التأكد من البريد الالكتروني وكلمة المرور" });
    console.log(err);
  }
});

app.post('/users/register', async (req, res) => {
  const newUser = req.body;

  try {
    const data = await fs.readFile(path.join(__dirname, './users.json'), 'utf8');
    const usersObj = JSON.parse(data);
    usersObj.users.push(newUser);

    await fs.writeFile(path.join(__dirname, './users.json'), JSON.stringify(usersObj, null, 2));
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
    console.log(err);
  }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));