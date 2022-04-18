const app = require('../index');

exports.triggerWebhook = (webhook, url, status) => {
  app.io.emit(
    webhook,
    `A check you have created for ${url} has its status changed. Current status is: ${status.toLowerCase()}`
  );
};
