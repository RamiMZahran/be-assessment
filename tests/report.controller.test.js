process.env.NODE_ENV = 'test';

const { ObjectId } = require('mongoose').Types;
const chai = require('chai');
const chaiHttp = require('chai-http');

const { User } = require('../models/User');
const { Check } = require('../models/Check');
const { Report } = require('../models/Report');
const server = require('../index');

let should = chai.should();
chai.use(chaiHttp);

describe('ReportController', () => {
  let token, user, check, report;
  before(async () => {
    user = new User({
      email: 'ramimohamed@test.com',
      password: '12345678',
    });
    await user.save();
    token = await user.generateAuthToken();

    check = new Check({
      user: user._id,
      name: 'AAA',
      url: 'google.com',
      protocol: 'HTTPS',
      httpHeaders: [],
      tags: ['tag1'],
      ignoreSSL: false,
    });
    await check.save();

    report = new Report({
      user: user._id,
      check: check._id,
      status: 'OK',
      availability: 100,
      outages: 0,
      downTimeInSeconds: 0,
      upTimeInSeconds: 0,
      responseTime: 0,
      history: [],
      updatesNumber: 1,
      nextCheckTime: new Date(),
    });
    await report.save();
  });
  after(async () => {
    await User.deleteMany();
    await Check.deleteMany();
    await Report.deleteMany();
  });

  describe('getCheckReport', () => {
    it('Should not get check if check id is invalid', (done) => {
      chai
        .request(server)
        .get(`/api/reports/${new ObjectId()}`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Report not found!');
          done();
        });
    });

    it('Should get check successfully if check data is correct', (done) => {
      chai
        .request(server)
        .get(`/api/reports/${check._id}`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('report');
          res.body.report.should.have.property('status').eql('OK');
          res.body.report.should.have.property('availability').eql(100);
          res.body.report.should.have.property('downTimeInSeconds').eql(0);

          done();
        });
    });
  });

  describe('getAllCheckReports', () => {
    it('Should get a list of reports', (done) => {
      chai
        .request(server)
        .get(`/api/reports/all`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('reports').have.length(1);
          done();
        });
    });

    it('Should get an object of reports grouped by tags', (done) => {
      chai
        .request(server)
        .get(`/api/reports/all?groupBy=tags`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('reports');
          res.body.reports.should.have.property('tag1').have.length(1);
          done();
        });
    });
  });
});
