const request = require('request');

const { Report } = require('../models/Report');

exports.getStatus = (url, protocol, path, port, timeout, authentication) => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      url: protocol.toLowerCase() + '://' + url,
      time: true,
      timeout,
    };
    if (port) requestOptions.port = port;
    if (path) requestOptions.url += path;
    if (authentication) requestOptions.auth = authentication;
    request.get(requestOptions, function (error, response) {
      resolve({
        site: url,
        responseTime: response.elapsedTime,
        status: !error && response.statusCode == 200 ? 'OK' : 'Down',
      });
    });
  });
};

exports.createCheckReport = async (userId, check, statusResponse) => {
  const nextCheckTime = new Date();
  nextCheckTime.setMinutes(
    nextCheckTime.getMinutes() + check.intervalInMinutes
  );
  const report = new Report({
    user: userId,
    check: check._id,
    status: statusResponse.status,
    availability: statusResponse.status == 'OK' ? 100 : 0,
    outages: statusResponse.status == 'OK' ? 0 : 1,
    downTimeInSeconds: 0,
    upTimeInSeconds: 0,
    responseTime: statusResponse.responseTime / 1000,
    updatesNumber: 1,
    history: [],
    nextCheckTime: nextCheckTime,
  });
  await report.save();
  return report;
};

exports.updateCheckReport = async (userId, checkId, statusResponse) => {
  const report = await Report.findOne({
    check: checkId,
    user: userId,
  }).populate('check');
  if (!report) return null;

  console.log(report.history);
  const history = { log: report.status.slice(), createdAt: new Date() };

  if (statusResponse.status == 'OK') {
    report.availability = 100;
    // report.outages = body.outages;
    // report.downTimeInSeconds = body.downTimeInSeconds;
    report.upTimeInSeconds += (new Date() - new Date(report.updatedAt)) * 1000;
    report.responseTime =
      (report.responseTime * report.updatesNumber +
        statusResponse.responseTime) /
      (report.updatesNumber + 1);
    report.updatesNumber++;
  } else {
    report.availability = 0;
    report.outages++;
    report.downTimeInSeconds +=
      (new Date() - new Date(report.updatedAt)) * 1000;
  }
  report.status = statusResponse.status;
  const nextCheckTime = new Date();
  nextCheckTime.setMinutes(
    nextCheckTime.getMinutes() + report.check.intervalInMinutes
  );
  report.nextCheckTime = nextCheckTime;
  const reportObj = report.toObject();

  reportObj.check = reportObj.check._id;
  delete reportObj.history;
  await Report.updateOne(
    { _id: report._id },
    { $set: { ...reportObj }, $push: { history: history } }
  );
  return report;
};

exports.deleteCheckReport = async (userId, checkId) => {
  const report = await Report.deleteOne({ check: checkId, user: userId });
  if (report.nModified === 0) return false;

  return true;
};

exports.getCheckReport = async (userId, checkId) => {
  const report = await Report.findOne({
    check: checkId,
    user: userId,
  }).populate('check');
  if (!report) return null;

  return report;
};

exports.getAllCheckReports = async (userId, groupBy) => {
  let reports = await Report.find({ user: userId }).populate('check');
  if (groupBy) {
    reports = reports.reduce((prevVal, currentVal) => {
      if (currentVal.check.tags.length > 0) {
        currentVal.check.tags.map((tag) => {
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
  return reports;
};

exports.getReports = async () => {
  let reports = await Report.find({
    nextCheckTime: { $lte: new Date() },
  })
    .populate('check')
    .populate('user');
  return reports;
};
