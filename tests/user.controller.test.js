process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { User } = require('../models/User');
const server = require('../index');

let should = chai.should();
chai.use(chaiHttp);
describe('UserAuthentication', () => {
  describe('postSignUp', () => {
    before(async () => {
      await User.deleteMany();
    });
    after(async () => {
      await User.deleteMany();
    });
    context('invalid data', () => {
      it('Should not Sign Up User with invalid user data', (done) => {
        const user = {
          email: 'ramimohamed',
          password: '12345678',
        };
        chai
          .request(server)
          .post('/api/auth/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors').eql([
              {
                value: 'ramimohamed',
                msg: 'Please enter a valid email',
                param: 'email',
                location: 'body',
              },
            ]);
            done();
          });
      });
    });
    context('exist User', () => {
      const user = {
        email: 'ramimohamed@test.com',
        password: '12345678',
      };
      before(async () => {
        const dbUser = new User(user);
        await dbUser.save();
        console.log('here first');
      });
      it('Should not Sign Up User if User email already exists', (done) => {
        chai
          .request(server)
          .post('/api/auth/signup')
          .send(user)
          .end((err, res) => {
            console.log('here second');

            res.should.have.status(400);
            done();
          });
      });
    });
    context('valid data', () => {
      before(async () => {
        await User.deleteMany();
      });
      it('Should Sign Up User Successfully with valid user data', (done) => {
        const user = {
          email: 'ramimohamed@test.com',
          password: '12345678',
        };
        chai
          .request(server)
          .post('/api/auth/signup')
          .send(user)
          .end(async (err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have
              .property('msg')
              .eql('User created successfully!');
            res.body.should.have.property('token');

            done();
          });
      });
    });
  });

  describe('postLogin', () => {
    before(async () => {
      const user = new User({
        email: 'ramimohamed@test.com',
        password: '12345678',
      });
      await user.save();
    });
    after(async () => {
      await User.deleteMany();
    });

    it('Should Login User successfully if user data is correct', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({
          email: 'ramimohamed@test.com',
          password: '12345678',
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('Should not Login User if user data is incomplete', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({
          email: 'rami.zahran@assesstm.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors').eql([
            {
              msg: 'Please enter a password with at least 6 characters',
              param: 'password',
              location: 'body',
            },
          ]);
          done();
        });
    });
    it('Should not Login User if user email is incorrect', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({
          email: 'rami@test.com',
          password: '12345678',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have
            .property('error')
            .eql('User rami@test.com not found.');
          done();
        });
    });
    it('Should not Login User if user password is incorrect', (done) => {
      chai
        .request(server)
        .post('/api/auth/login')
        .send({
          email: 'ramimohamed@test.com',
          password: '1234567',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('Wrong Email or Password');
          done();
        });
    });
  });
});
