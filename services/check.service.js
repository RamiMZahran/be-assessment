const { Check } = require('../models/Check');

exports.createCheck = async (userId, body) => {
  const check = new Check({
    user: userId,
    name: body.name,
    url: body.url,
    protocol: body.protocol,
    path: body.path,
    port: body.port,
    webhook: body.webhook,
    timeoutInSeconds: body.timeoutInSeconds,
    intervalInMinutes: body.intervalInMinutes,
    threshold: body.threshold,
    authentication: body.authentication,
    httpHeaders: body.httpHeaders,
    assert: body.assert,
    tags: body.tags,
    ignoreSSL: body.ignoreSSL,
  });
  await check.save();
  return check;
};

exports.updateCheck = async (userId, checkId, body) => {
  const check = await Check.findOne({ _id: checkId, user: userId });
  if (!check) return null;
  if (body.name) check.name = body.name;
  if (body.url) check.url = body.url;
  if (body.protocol) check.protocol = body.protocol;
  if (body.path) check.path = body.path;
  if (body.port) check.port = body.port;
  if (body.webhook) check.webhook = body.webhook;
  if (body.timeoutInSeconds) check.timeoutInSeconds = body.timeoutInSeconds;
  if (body.intervalInMinutes) check.intervalInMinutes = body.intervalInMinutes;
  if (body.threshold) check.threshold = body.threshold;
  if (body.authentication) check.authentication = body.authentication;
  if (body.httpHeaders) check.httpHeaders = body.httpHeaders;
  if (body.assert) check.assert = body.assert;
  if (body.tags) check.tags = body.tags;
  if (body.ignoreSSL) check.ignoreSSL = body.ignoreSSL;

  await check.save();
  return check;
};

exports.deleteCheck = async (userId, checkId) => {
  const check = await Check.deleteOne({ _id: checkId, user: userId });
  if (check.deletedCount === 0) return false;

  return true;
};

exports.getCheck = async (userId, checkId) => {
  const check = await Check.findOne({ _id: checkId, user: userId });
  if (!check) return null;

  return check;
};

exports.getAllChecks = async (userId, groupBy) => {
  let checks = await Check.aggregate([{ $match: { user: userId } }]);
  if (groupBy === 'tags') {
    checks = checks.reduce((prevVal, currentVal) => {
      if (currentVal.tags.length > 0) {
        currentVal.tags.map((tag) => {
          prevVal[tag]
            ? prevVal[tag].push(currentVal)
            : (prevVal[tag] = [currentVal]);
        });
      } else {
        prevVal['none']
          ? prevVal['none'].push(currentVal)
          : (prevVal['none'] = [currentVal]);
      }
      return prevVal;
    }, {});
  }
  return checks;
};
