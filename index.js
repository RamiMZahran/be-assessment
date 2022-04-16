const mongoose = require('mongoose');
const express = require('express');

require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('DB Connected successfully!');
  })
  .catch((err) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running.'
    );
    console.log(err);
  });

//   cronService.start();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Token'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
