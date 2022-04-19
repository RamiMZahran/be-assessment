const reportService = require('../services/report.service');

exports.getCheckReport = async (req, res) => {
  try {
    const report = await reportService.getCheckReport(
      req.user._id,
      req.params.checkId
    );

    if (!report) return res.status(404).send({ error: 'Report not found!' });

    return res.status(200).send({ msg: 'Report fetched successfully', report });
  } catch (err) {
    return res.status(500).send({ error: 'Error fetching report' });
  }
};

exports.getAllCheckReports = async (req, res) => {
  try {
    const reports = await reportService.getAllCheckReports(
      req.user._id,
      req.query.groupBy
    );

    return res
      .status(200)
      .send({ msg: 'Reports fetched successfully', reports });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Error fetching checks' });
  }
};
