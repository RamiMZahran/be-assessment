const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    check: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Check',
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    availability: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    outages: {
      type: Number,
      required: true,
      default: 0,
    },
    downTimeInSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    upTimeInSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    responseTime: {
      type: Number,
      required: true,
      min: 0,
    },
    history: {
      log: String,
      createdAt: Date,
    },
    updatesNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    nextCheckTime: { type: Date, required: true },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = { Report };
