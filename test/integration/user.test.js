const request = require('supertest');
const app = require("../../app");
const { generateToken} = require("../../helpers/manage-tokens");
const status = require('http-status');


const {
    mockId,
    userOne,
    userTwo,
    setupDatabase,
    teardownDatabase
} = require("../fixtures/db");

    describe('/api/users/', () => {

        beforeEach(async() => {
            await teardownDatabase()       
        });
        
        afterEach(async() => {
            await teardownDatabase()   
            await app.close();
        });

                
        describe('GET: /api/users/', () => {

            it('should return a valid user', async() => {
              
                await setupDatabase() 

                const res = await request(app)
                    .get('/api/users/')
                    .send();

                expect(res.status).toEqual(status.OK);
                expect(res.body.length).toEqual(2);
             });


            it('should return 404 if a user was not found', async() => {
              
                const res = await request(app)
                    .get('/api/users/')
                    .send();

                expect(res.status).toEqual(status.NOT_FOUND);
             });
        
           
        });
        
        describe('GET: /api/users/:id', () => {

            it('should return a valid user', async() => {
              
                await setupDatabase() 

                const res = await request(app)
                    .get(`/api/users/${userTwo._id}`)
                    .send();

                expect(res.status).toEqual(status.OK);
              });


            it('should return 404 if a user was not found', async() => {
              
                const res = await request(app)
                    .get(`/api/users/${mockId}`)
                    .send();

                expect(res.status).toEqual(status.NOT_FOUND);
             });
        });  
        
        describe('POST: /api/users/', () => {

            it('should create a new user and return 200', async() => {
                const res = await request(app)
                    .post('/api/users/')
                    .send(userOne);
        
                expect(res.status).toEqual(status.CREATED);
                expect(res.body._id).not.toBeNull()
                expect(res.body.name).toEqual("Test One")
            });
        
            it('should return a valid token if a user was successfully created', async() => {
                const res = await request(app)
                    .post('/api/users/')
                    .send(userOne);
        
                expect(res.header).toHaveProperty("authorization");
                expect(res.header.authorization).toBeTruthy();
            });
        
            it('should return 400 if a bad input was supplied', async() => {
                const res = await request(app)
                    .post('/api/users/')
                    .send({});
        
                expect(res.status).toEqual(status.BAD_REQUEST);
            });
        });
    
        describe('UPDATE: /api/users/me', () => {

            it('should return 200 if a user was successfully updated', async() => {
              
                await setupDatabase() 
                const token = generateToken(userTwo)

                const res = await request(app)
                    .patch(`/api/users/me`)
                    .set("authorization", token)
                    .send({name: "User Two"});

                expect(res.status).toEqual(status.OK);
                expect(res.body.name).toEqual('User Two');
                expect(res.header.authorization).not.toBeNull();
              });


            it('should return 400 if an invalid data was sent', async() => {
              
                await setupDatabase() 
                const token = generateToken(userTwo)

                const res = await request(app)
                    .patch(`/api/users/me`)
                    .set("authorization", token)
                    .send({name: ''});

                expect(res.status).toEqual(status.BAD_REQUEST);
          
              }); 
        });


        describe('DELETE: /api/users/me', () => {

            it('should return 200 if a user was successfully deleted', async() => {
              
                await setupDatabase() 
                const token = generateToken(userTwo)

                const res = await request(app)
                    .delete(`/api/users/me`)
                    .set("authorization", token)
                    .send();
            
                
                expect(res.status).toEqual(status.OK);
                expect(res.body).toHaveProperty('_id');
                expect(JSON.stringify(res.body._id)).toEqual(JSON.stringify(userTwo._id));
               
              });


            it('should return 401 if bad token or no token was provided', async() => {
              
                await setupDatabase() 
                const token = generateToken(userTwo)

                const res = await request(app)
                    .delete(`/api/users/me`)
                    .set("authorization", 'wrongtoken')
                    .send();
            
                
                expect(res.status).toEqual(status.UNAUTHORIZED);
 
               
              });
 
        });



    });



    


  

