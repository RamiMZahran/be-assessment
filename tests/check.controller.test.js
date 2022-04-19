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

describe('CheckController', () => {
  let token, user;
  before(async () => {
    user = new User({
      email: 'ramimohamed@test.com',
      password: '12345678',
    });
    await user.save();
    token = await user.generateAuthToken();
  });
  after(async () => {
    await User.deleteMany();
  });

  describe('createCheck', () => {
    before(async () => {
      await Check.deleteMany();
      await Report.deleteMany();
    });
    after(async () => {
      await Check.deleteMany();
      await Report.deleteMany();
    });
    it('Should create check successfully if check data is correct', (done) => {
      chai
        .request(server)
        .post('/api/checks')
        .send({
          name: 'AAA',
          url: 'google.com',
          ignoreSSL: false,
          protocol: 'HTTPS',
        })
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('report');
          res.body.should.have.property('check');
          res.body.check.should.have.property('name').eql('AAA');
          res.body.check.should.have.property('url').eql('google.com');
          res.body.check.should.have.property('ignoreSSL').eql(false);
          res.body.check.should.have.property('protocol').eql('HTTPS');
          res.body.check.should.have.property('timeoutInSeconds').eql(5);
          res.body.check.should.have.property('intervalInMinutes').eql(10);

          res.body.report.should.have.property('status').eql('OK');
          res.body.report.should.have.property('availability').eql(100);
          res.body.report.should.have.property('outages').eql(0);
          done();
        });
    });
    it('Should not create check if check data is not correct', (done) => {
      chai
        .request(server)
        .post('/api/checks')
        .send({
          ignoreSSL: false,
          protocol: 'HTTPS',
        })
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors').eql([
            { msg: 'Invalid value', param: 'name', location: 'body' },
            { msg: 'Invalid value', param: 'url', location: 'body' },
          ]);
          done();
        });
    });
  });
  describe('updateCheck', () => {
    let check;
    before(async () => {
      check = new Check({
        user: user._id,
        name: 'AAA',
        url: 'google.com',
        protocol: 'HTTPS',
        httpHeaders: [],
        tags: [],
        ignoreSSL: false,
      });
      await check.save();
    });
    after(async () => {
      await Check.deleteMany();
      await Report.deleteMany();
    });
    it('Should not update check if check id is invalid', (done) => {
      chai
        .request(server)
        .put(`/api/checks/${new ObjectId()}`)
        .send({
          name: 'AAA Update',
        })
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Check not found!');
          done();
        });
    });

    it('Should update check successfully if check data is correct', (done) => {
      chai
        .request(server)
        .put(`/api/checks/${check._id}`)
        .send({
          name: 'AAA Update',
        })
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('check');
          res.body.check.should.have.property('name').eql('AAA Update');
          res.body.check.should.have.property('url').eql('google.com');
          res.body.check.should.have.property('ignoreSSL').eql(false);
          res.body.check.should.have.property('protocol').eql('HTTPS');
          res.body.check.should.have.property('timeoutInSeconds').eql(5);
          res.body.check.should.have.property('intervalInMinutes').eql(10);
          done();
        });
    });
  });

  describe('deleteCheck', () => {
    let check;
    before(async () => {
      check = new Check({
        user: user._id,
        name: 'AAA',
        url: 'google.com',
        protocol: 'HTTPS',
        httpHeaders: [],
        tags: [],
        ignoreSSL: false,
      });
      await check.save();
    });
    after(async () => {
      await Check.deleteMany();
      await Report.deleteMany();
    });
    it('Should not delete check if check id is invalid', (done) => {
      chai
        .request(server)
        .delete(`/api/checks/${new ObjectId()}`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Check not found!');
          done();
        });
    });

    it('Should delete check successfully if check data is correct', (done) => {
      chai
        .request(server)
        .delete(`/api/checks/${check._id}`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('getCheck', () => {
    let check;
    before(async () => {
      check = new Check({
        user: user._id,
        name: 'AAA',
        url: 'google.com',
        protocol: 'HTTPS',
        httpHeaders: [],
        tags: [],
        ignoreSSL: false,
      });
      await check.save();
    });
    after(async () => {
      await Check.deleteMany();
      await Report.deleteMany();
    });
    it('Should not get check if check id is invalid', (done) => {
      chai
        .request(server)
        .get(`/api/checks/${new ObjectId()}`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Check not found!');
          done();
        });
    });

    it('Should get check successfully if check data is correct', (done) => {
      chai
        .request(server)
        .get(`/api/checks/${check._id}`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('check');
          res.body.check.should.have.property('name').eql('AAA');
          res.body.check.should.have.property('url').eql('google.com');
          res.body.check.should.have.property('ignoreSSL').eql(false);
          res.body.check.should.have.property('protocol').eql('HTTPS');
          res.body.check.should.have.property('timeoutInSeconds').eql(5);
          res.body.check.should.have.property('intervalInMinutes').eql(10);
          done();
        });
    });
  });

  describe('getAllChecks', () => {
    let check;
    before(async () => {
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
    });
    after(async () => {
      await Check.deleteMany();
      await Report.deleteMany();
    });
    it('Should get a list of checks', (done) => {
      chai
        .request(server)
        .get(`/api/checks/all`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('checks').have.length(1);
          done();
        });
    });

    it('Should get an object of checks grouped by tags', (done) => {
      chai
        .request(server)
        .get(`/api/checks/all?groupBy=tags`)
        .set('token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('checks');
          res.body.checks.should.have.property('tag1').have.length(1);
          done();
        });
    });
  });
});
