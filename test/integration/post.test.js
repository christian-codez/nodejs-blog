const request = require('supertest');
const app = require("../../app");
const { generateToken} = require("../../helpers/manage-tokens");
const status = require('http-status');

const {
    mockId,
    userTwo,
    PostThree,
    postOne,
    setupDatabase,
    teardownDatabase
} = require("../fixtures/db");

describe('/api/posts/', () => {
    beforeEach(async() => {
        await teardownDatabase()       
    });
    
    afterEach(async() => {
        await teardownDatabase()   
        await app.close();
    });


    describe('GET: /api/posts/', () => {

        it('should create a new post and return 200', async() => {
          
            await setupDatabase() 

            const res = await request(app)
                .get('/api/posts/')
                .send();

            expect(res.status).toEqual(status.OK);
            expect(res.body.length).toEqual(2);
         });


        it('should return 404 if post does not exist', async() => {

            const res = await request(app)
                .get('/api/posts/')
                .send();

            expect(res.status).toEqual(status.NOT_FOUND);
          });
    });
    
    
    describe('GET: /api/posts/user/:userId', () => {

        it('should return 200 if a post was found based on a user ID', async() => {
          
            await setupDatabase() 

            const res = await request(app)
                .get(`/api/posts/user/${userTwo._id}`)
                .send();

            expect(res.status).toEqual(status.OK);
          });
          
          it('should return 404 if a post was not found based on a user ID', async() => {
          
            await setupDatabase() 

            const res = await request(app)
                .get(`/api/posts/user/${mockId}`)
                .send();

            expect(res.status).toEqual(status.NOT_FOUND);
          });
 
    });
    
    
    describe('GET: /api/posts/search?s=keyword ', () => {

        it('should return 404 if a post was not found based on a search keyword', async() => {
          
            await setupDatabase() 

            const res = await request(app)
                .get(`/api/posts/search?s=NotFound`)
                .send();

            expect(res.status).toEqual(status.NOT_FOUND);
          });


        it('should return 200 if a post was found based on a search keyword', async() => {
          
            await setupDatabase() 

            const res = await request(app)
                .get(`/api/posts/search?s=One`)
                .send();

            expect(res.status).toEqual(status.OK);
          });
          
          
          it('should return 400 if no search keyword was provided', async() => {
          
            await setupDatabase() 

            const res = await request(app)
                .get(`/api/posts/search`)
                .send();

            expect(res.status).toEqual(status.BAD_REQUEST);
          });
    });

    describe('POST: /api/posts/', () => {

        it('should return 201 if a post was created!', async() => {
          
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .post(`/api/posts/`)
                .set("authorization", token)
                .send(PostThree);

            expect(res.status).toEqual(status.CREATED);
          });
          
          it('should return 400 if invalid post data was sent', async() => {
          
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .post(`/api/posts/`)
                .set("authorization", token)
                .send({'title': 'Test Title'});

            expect(res.status).toEqual(status.BAD_REQUEST);
          });
    });


    describe('UPDATE: /api/posts/', () => {

        it('should return 200 if a post was updated!', async() => {
          
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .patch(`/api/posts/${postOne._id}`)
                .set("authorization", token)
                .send({title: 'New Title'});

            expect(res.status).toEqual(status.OK);
            expect(res.body.title).toEqual('New Title');
          }); 
          
          it('should return 400 if an invalid data was sent!', async() => {
          
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .patch(`/api/posts/${postOne._id}`)
                .set("authorization", token)
                .send({title: ''});

            expect(res.status).toEqual(status.BAD_REQUEST);
           });
           
           
          it('should return 400 if an invalid post ID was provided!', async() => {
          
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .patch(`/api/posts/123421`)
                .set("authorization", token)
                .send({title: ''});

            expect(res.status).toEqual(status.BAD_REQUEST);
           });
       
    });


    describe('DELETE: /api/posts/', () => {

        it('should return 200 if a post was deleted!', async() => {
          
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .delete(`/api/posts/${postOne._id}`)
                .set("authorization", token)
                .send();

            expect(res.status).toEqual(status.OK);
        }); 
        
        
        it('should return 400 if an invalid post ID was provided!', async() => {
          
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .delete(`/api/posts/invalid123`)
                .set("authorization", token)
                .send();

            expect(res.status).toEqual(status.BAD_REQUEST);
        }); 
   });
});