const faker = require("faker");
const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest');


let email = (faker.internet.email()).toLowerCase();
let password = (faker.internet.password()).toLowerCase();


//test signin route for admin signin

describe('POST /api/auth/create-user', function () {
   
    it('should be able to create a new user /test', function (done) {
        request(app)
            .post('/api/v1/auth/create-user')
            .send({
                "firstName": faker.name.firstName(),
                "lastName": faker.name.lastName(),
                "email": email,
                "password": password,
                "gender": 'm',
                "jobRole": faker.name.jobArea(),
                "department": 'IT',
                "address": faker.address.streetAddress()
            })
            .set('Accept', 'application/json')
            // .set('Authorization', 'Bearer ' + token)
            .expect(201, done);
    });
});

//test user signin after account creation
describe('POST  /api/v1/auth/signin', function () {
    const authenticatedUser = request.agent(app)
    it('respond with 200  / test account for just created user ', function (done) {
        request(app)
        authenticatedUser
            .post('/api/v1/auth/signin')
            .send({
                "email": email,
                "password": password
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    })
    it('respond with 404 not found / test random user account that does not yet exist', function (done) {
        request(app)
        authenticatedUser
            .post('/api/v1/auth/signin')
            .send({
                "email": (faker.internet.email()).toLowerCase(),
                "password": (faker.internet.password()).toLowerCase()
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});