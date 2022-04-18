const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const checkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    protocol: { type: String, required: true, enum: ['HTTP', 'HTTPS', 'TCP'] },
    path: String,
    port: String,
    webhook: String,
    timeoutInSeconds: { type: Number, default: 5 },
    intervalInMinutes: { type: Number, default: 10 },
    threshold: { type: Number, default: 1 },
    authentication: {
      username: String,
      password: String,
    },
    httpHeaders: [
      {
        key: String,
        value: String,
      },
    ],
    assert: {
      statusCode: Number,
    },
    tags: [String],
    ignoreSSL: { type: Boolean, required: true },
  },
  { timestamps: true }
);

checkSchema.index({ user: 1 });
checkSchema.index({ tags: 1 });

checkSchema.plugin(uniqueValidator);

const Check = mongoose.model('Check', checkSchema);

module.exports = { Check };
