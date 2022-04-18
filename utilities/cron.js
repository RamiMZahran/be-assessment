const cron = require('node-cron');

const { sendEmail } = require('./sendEmail');
const { triggerWebhook } = require('./webhook');

const reportService = require('../services/report.service');

exports.task = cron.schedule(
  '* * * * *',
  async () => {
    console.log('Cron job started');
    const reports = await reportService.getReports();
    reports.forEach(async (report) => {
      const response = await reportService.getStatus(
        report.check.url,
        report.check.protocol,
        report.check.path,
        report.check.port,
        report.check.timeout,
        report.check.authentication
      );
      const update = await reportService.updateCheckReport(
        report.user._id,
        report.check._id,
        response
      );
      if (update.status !== report.status) {
        sendEmail(report.user.email, report.check.url, update.status);
        if (report.check.webhook)
          triggerWebhook(report.check.webhook, report.check.url, update.status);
      }
    });
  },
  {
    scheduled: false,
  }
);
