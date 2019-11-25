//process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const app = require('../app');
let should = chai.should();
const faker = require("faker");

let email = (faker.internet.email()).toLowerCase();
let password = (faker.internet.password()).toLowerCase();

let token = '';
let userID = 0;
let gifID = 0;
let articleID = 0;


chai.use(chaiHttp);

describe('POST /api/auth/create-user', () => {

    it('should be able to create a new user /test', (done) => {
        chai.request(app)
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
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
});

//test user signin after account creation
describe('POST  /api/v1/auth/signin', () => {
    it('respond with 200  / test account for just created user ', (done) => {
        chai.request(app)
            .post('/api/v1/auth/signin')
            .send({
                "email": email,
                "password": password
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property('UserID');
                res.body.data.should.have.property('token');

                token = res.body.data.token;
                userID = res.body.data.UserID;

                done();

                if (err) {
                    if (err) return done(err);
                }

            });

    })

});

//create test Gif routes
describe('POST /api/v1/gifs', () => {

    it('should not be able to consume the route /test since no token was sent', (done) => {
        chai.request(app)
            .post('/api/v1/gifs')
            .field('title', faker.lorem.sentence())
            .field('userId', userID)
            .attach('image', 'test/small-gif.gif')
            .set('Content-Type', 'multipart/form-data')
            .end((err, res) => {
                res.should.have.status(403);

                done();

                if (err) {
                    if (err) return done(err);
                }

            });

    });


    it('should be able to consume the route /test since a valid token was sent and and upload gif', (done) => {
        chai.request(app)
            .post('/api/v1/gifs')
            .field('title', faker.lorem.sentence())
            .field('userId', userID)
            .attach('image', 'test/small-gif.gif')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                res.should.have.status(201);

                res.body.should.be.a('object');
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('title');
                res.body.data.should.have.property('message');
                res.body.data.should.have.property('gifID');
                res.body.data.should.have.property('imageUrl');

                gifID = res.body.data.gifID;
                done();

                if (err) {
                    if (err) return done(err);
                }

            });

    });

});

describe('POST /api/v1/articles', () => {

    it('should be able to create an new article', (done) => {
        chai.request(app)
            .post('/api/v1/articles')
            .send({
                "title": faker.lorem.words(3),
                "article": faker.lorem.paragraph(),
                "userId": userID
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(201);

                res.body.should.be.a('object');
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('title');

                articleID = res.body.data.articleID;
                done();

                if (err) {
                    if (err) return done(err);
                }
            });
    });

    it('should not be able to consume this route since no token was set', (done) => {
        chai.request(app)
            .post('/api/v1/articles')
            .send({
                "title": faker.lorem.words(3),
                "article": faker.lorem.paragraph(),
                "userId": userID
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.should.have.status(403);
                done();

                if (err) {
                    if (err) return done(err);
                }
            });
    });
});


describe('GET /api/v1/articles/:<articleID>', () => {

    it('it should GET a single article', (done) => {
        // console.log(articleID);

        chai.request(app)
            .get('/api/v1/articles/' + articleID)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();

                if (err) {
                    if (err) return done(err);
                }
            });

    });


    it('it  should not be able GET a single article since no token was sent', (done) => {
        chai.request(app)
            .get('/api/v1/articles/' + articleID)
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                done();
                if (err) {
                    if (err) return done(err);
                }
            });


    });

});


describe('GET /api/v1/gifs/:<gifID>', () => {

    it('it should GET a single gif', (done) => {
        //   console.log(gifID);

        chai.request(app)
            .get('/api/v1/gifs/' + gifID)
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                done();
                if (err) {
                    if (err) return done(err);
                }
            });

    });


    it('it  should not be able GET a single gif since no token was sent', (done) => {
        chai.request(app)
            .get('/api/v1/gifs/' + gifID)
            .end((err, res) => {
                res.should.have.status(403);

                done();
                if (err) {
                    if (err) return done(err);
                }
            });


    });

});

describe('POST /api/v1/gifs/:<gifID>/comment', () => {

    it('it should Create a comment for a gif', (done) => {
        //   console.log(gifID);

        chai.request(app)
            .post('/api/v1/gifs/' + gifID + '/comment')
            .send({
                "comment": faker.lorem.sentence(4),
                "userId": userID
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');

                done();
                if (err) {
                    if (err) return done(err);
                }
            });

    });


    it('it  should not be able create comment for gif since no token was sent', (done) => {
        chai.request(app)
            .post('/api/v1/gifs/' + gifID + '/comment')
            .send({
                "comment": faker.lorem.sentence(4),
                "userId": userID
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.should.have.status(403);

                done();
                if (err) {
                    if (err) return done(err);
                }
            });


    });

});

//add comment to article
describe('POST /api/v1/articles/:<articleID>/comment', () => {

    it('it should Create a comment for an article', (done) => {

        chai.request(app)
            .post('/api/v1/articles/' + articleID + '/comment')
            .send({
                "comment": faker.lorem.sentence(4),
                "userId": userID
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');

                done();
                if (err) {
                    if (err) return done(err);
                }
            });

    });


    it('it  should not be able create comment for article since no token was sent', (done) => {
        chai.request(app)
            .post('/api/v1/articles/' + articleID + '/comment')
            .send({
                "comment": faker.lorem.sentence(4),
                "userId": userID
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.should.have.status(403);

                done();
                if (err) {
                    if (err) return done(err);
                }
            });


    });

});

//update  article
describe('PATCH /api/v1/articles/:<articleID>', () => {

    it('it should Update the just created article for an article', (done) => {

        chai.request(app)
            .patch('/api/v1/articles/' + articleID)
            .send({
                "title": faker.lorem.words(3),
                "article": faker.lorem.paragraph(),
                "userId": userID
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');

                done();
                if (err) {
                    if (err) return done(err);
                }
            });

    });


    it('it  should not be able update article since no token was sent', (done) => {
        chai.request(app)
            .patch('/api/v1/articles/' + articleID)
            .send({
                "title": faker.lorem.words(3),
                "article": faker.lorem.paragraph(),
                "userId": userID
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.should.have.status(403);

                done();
                if (err) {
                    if (err) return done(err);
                }
            });


    });

});

//get feed
describe('GET /api/v1/feed', () => {

    it('it should GET feeds', (done) => {
        //   console.log(gifID);

        chai.request(app)
            .get('/api/v1/feed')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                done();
                if (err) {
                    if (err) return done(err);
                }
            });

    });


    it('it  should not be able GET feed since no token was sent', (done) => {
        chai.request(app)
            .get('/api/v1/feed')
            .end((err, res) => {
                res.should.have.status(403);

                done();
                if (err) {
                    if (err) return done(err);
                }
            });


    });

});

//delete  article
describe('DELETE /api/v1/articles/:<articleID>', () => {

    it('it should Delete the just created article for an article', (done) => {

        chai.request(app)
            .delete('/api/v1/articles/' + articleID)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.a('object');

                done();
                if (err) {
                    if (err) return done(err);
                }
            });

    });


    it('it  should not be able delete article since no token was sent', (done) => {
        chai.request(app)
            .delete('/api/v1/articles/' + articleID)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.should.have.status(403);

                done();
                if (err) {
                    if (err) return done(err);
                }
            });


    });

});

//delete  gif
describe('DELETE /api/v1/gifs/:<gifID>', () => {

    it('it should Delete the just created gif', (done) => {

        chai.request(app)
            .delete('/api/v1/gifs/' + gifID)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.a('object');

                done();
                if (err) {
                    if (err) return done(err);
                }
            });

    });


    it('it  should not be able delete gif since no token was sent', (done) => {
        chai.request(app)
            .delete('/api/v1/gifs/' + gifID)
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.should.have.status(403);

                done();
                if (err) {
                    if (err) return done(err);
                }
            });


    });

    it('it should Return 404 since gif has been deleted', (done) => {

        chai.request(app)
            .delete('/api/v1/gifs/' + gifID)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');

                done();
                if (err) {
                    if (err) return done(err);
                }
            });

    });

});


//Our parent block
// describe('Books', () => {
//     beforeEach((done) => { //Before each test we empty the database
//         Book.remove({}, (err) => { 
//            done();           
//         });        
//     });
// /*
//   * Test the /GET route
//   */
//   describe('/GET book', () => {
//       it('it should GET all the books', (done) => {
//         chai.request(app)
//             .get('/book')
//             .end((err, res) => {
//                   res.should.have.status(200);
//                   res.body.should.be.a('array');
//                   res.body.length.should.be.eql(0);
//               done();
//             });
//       });
//   });

// });