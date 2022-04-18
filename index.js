const mongoose = require('mongoose');
const express = require('express');

require('dotenv').config();

const authRoutes = require('./routes/auth.route');
const checkRoutes = require('./routes/check.route');
const reportRoutes = require('./routes/report.route');

const { task } = require('./utilities/cron');

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

task.start();

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
app.use('/api/checks', checkRoutes);
app.use('/api/reports', reportRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
