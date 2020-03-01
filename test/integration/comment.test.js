const request = require('supertest');
const app = require("../../app");
const { generateToken} = require("../../helpers/manage-tokens");
const status = require('http-status');

const {
    mockId,
    userTwo,
    PostThree,
    commentId,
    postTwo,
    postOne,
    setupDatabase,
    teardownDatabase
} = require("../fixtures/db");

describe('/api/comments/', () => {
    beforeEach(async() => {
        await teardownDatabase()       
    });
    
    afterEach(async() => {
        await teardownDatabase()   
        await app.close();
    });


    describe('GET: /api/comments/:postID', () => {

        it('should return all comments related to a particluar post', async() => {
            await setupDatabase() 

            const res = await request(app)
                .get(`/api/comments/${postOne._id}`)
                .send();
                                 
            expect(res.status).toEqual(status.OK)
            expect(res.body[0].comments.length).toEqual(2)
         });


        it('should return 404 if comment does not exist', async() => {
            await setupDatabase() 

            const res = await request(app)
                .get(`/api/comments/${postTwo._id}`)
                .send();

                console.log('STATUS: ', res.status)                 
            expect(res.status).toEqual(status.NOT_FOUND)
          });
 
    }); 
    
    
    describe('POST: /api/comments/:postID', () => {
 
        it('should post a new comment', async() => {
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .post(`/api/comments/${postOne._id}`)
                .set("authorization", token)
                .send({
                    "comment": "This is a another great comment 1"
                });
                                
            expect(res.status).toEqual(status.OK)
            expect(res.body.comments.length).toEqual(3)
          });


        it('should return 400 if a bad request was sent', async() => {
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .post(`/api/comments/${postOne._id}`)
                .set("authorization", token)
                .send({
                    "comment": ""
                });
                                 
            expect(res.status).toEqual(status.BAD_REQUEST)
           });
 
    });
    
    describe('PATCH: /api/comments/:post_id/:comment_id', () => {
 
        it('should post a new comment', async() => {
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .patch(`/api/comments/${postOne._id}/${commentId}`)
                .set("authorization", token)
                .send({
                    "comment": "This is a another great comment 1"
                });
                                 
            expect(res.status).toEqual(status.OK)
            expect(res.body.nModified).toEqual(1)
          });
 
    });
    
    describe('DELETE: /api/comments/:post_id/:comment_id', () => {
 
        it('should delete new comment', async() => {
            await setupDatabase() 
            const token = generateToken(userTwo)
            const res = await request(app)
                .delete(`/api/comments/${postOne._id}/${commentId}`)
                .set("authorization", token)
                .send();
                                
            expect(res.status).toEqual(status.OK)
            expect(res.body.nModified).toEqual(1)
          });
 
    });
 
});