/* eslint-disable indent */
// Source:  https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/

// const supertest = require('supertest');
import supertest from 'supertest';

// This agent refers to PORT where program is runninng.
const server = supertest.agent('http://localhost:5501');

// UNIT test begin
describe('GET /', () => {
    it('responds with "HTML form"', (done) => {
        server
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, /form/)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});

describe('GET /api/vehicles', () => {
    it('responds with json data of vehicles', (done) => {
        server
            .get('/api/vehicles')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });
});

describe('GET /api/customers', () => {
    it('responds with json data of customers', (done) => {
        server
            .get('/api/customers')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });
});

describe('POST /api/return-all', () => {
    it('responds with success of buying previously returned vehicle', (done) => {
        server
            .post('/api/return-all')
            .expect(200, `All vehicles have been returned`)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });
});

describe('POST /api/rent', () => {
    let id = 1;
    let firstName = "Kamil";
    let lastName = "Kowalczyk";
    it('responds with success of renting vehicle', (done) => {
        server
            .post('/api/rent')
            .send(`arguments=${id}, ${firstName}, ${lastName}`)
            .expect(200, `Vehicle ID ${id} has been rent by ${firstName} ${lastName}\n`)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });
});

describe('POST /api/return', () => {
    let id = 1;
    let firstName = "Kamil";
    let lastName = "Kowalczyk";
    it('responds with success of returning previously rented vehicle', (done) => {
        server
            .post('/api/return')
            .send(`arguments=${id}, ${firstName}, ${lastName}`)
            .expect(200, `Vehicle ID ${id} has been returned`)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });
});

describe('POST /api/buy', () => {
    let id = 1;
    let firstName = "Kamil";
    let lastName = "Kowalczyk";
    it('responds with success of buying previously returned vehicle', (done) => {
        server
            .post('/api/buy')
            .send(`arguments=${id}, ${firstName}, ${lastName}`)
            .expect(200, `Vehicle ID ${id} has been bought by ${firstName} ${lastName}\n`)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });
});
// UNIT test end