const checkService = require('../services/check.service');
const reportService = require('../services/report.service');
const { validationResult } = require('express-validator');

exports.createCheck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const check = await checkService.createCheck(req.user._id, req.body);

    const resp = await reportService.getStatus(
      req.body.url,
      req.body.protocol,
      req.body.path,
      req.body.port,
      req.body.timeout,
      req.body.authentication
    );
    const report = await reportService.createCheckReport(
      req.user._id,
      check,
      resp
    );
    return res
      .status(201)
      .send({ msg: 'Check created successfully', check, report });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Error creating check' });
  }
};

exports.updateCheck = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const check = await checkService.updateCheck(
      req.user._id,
      req.params.id,
      req.body
    );

    if (!check) return res.status(404).send({ error: 'Check not found!' });

    return res.status(200).send({ msg: 'Check updated successfully', check });
  } catch (err) {
    return res.status(500).send({ error: 'Error updating check' });
  }
};
exports.deleteCheck = async (req, res) => {
  try {
    const response = await checkService.deleteCheck(
      req.user._id,
      req.params.id
    );

    if (!response) return res.status(404).send({ error: 'Check not found!' });

    await reportService.deleteCheckReport(req.user._id, req.params.id);

    return res.status(200).send({ msg: 'Check deleted successfully' });
  } catch (err) {
    return res.status(500).send({ error: 'Error deleting check' });
  }
};

exports.getCheck = async (req, res) => {
  try {
    const check = await checkService.getCheck(req.user._id, req.params.id);

    if (!check) return res.status(404).send({ error: 'Check not found!' });

    return res.status(200).send({ msg: 'Check fetched successfully', check });
  } catch (err) {
    return res.status(500).send({ error: 'Error fetching check' });
  }
};

exports.getAllChecks = async (req, res) => {
  try {
    const checks = await checkService.getAllChecks(
      req.user._id,
      req.query.groupBy
    );

    return res.status(200).send({ msg: 'Checks fetched successfully', checks });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Error fetching checks' });
  }
};
