const cron = require('node-cron');

const reportService = require('../services/report.service');

exports.task = cron.schedule(
  '* * * * *',
  async () => {
    console.log('Cron job started');
    const reports = await reportService.getAllReports();
    reports.forEach(async (report) => {
      const response = await reportService.getStatus(report.check.url);
      const update = await reportService.updateCheckReport(
        report.user,
        report.check._id,
        response
      );
      console.log(update);
    });
  },
  {
    scheduled: false,
  }
);
