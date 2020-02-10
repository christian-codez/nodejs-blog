/**
 * @jest-environment node
 */

const request = require('supertest');
const { User } = require("../../models/user");

let server, mockUser;

const createUsers = async() => {
    await User.collection.insertMany([{
            "name": "John Doe",
            "email": "abc@gmail.com",
            "password": "12345",
            "gender": "male",
            "country": "USA",
            "age": "28",
            "bio": "This is a sample bio",
            "stacks": ["python", "nodejs"]
        },
        {
            "name": "Mary Doe",
            "email": "xyz@gmail.com",
            "password": "12345",
            "gender": "female",
            "country": "Brazil",
            "age": "28",
            "bio": "This is a sample bio",
            "stacks": ["python", "nodejs"]
        }


    ])
}

const createUser = async() => {
    const user = new User(mockUser);
    return await user.save();
}


describe('/api/users', () => {

    beforeEach(async() => {
        server = require("../../app");
        mockUser = {
            "name": "John Doe",
            "email": "test1@gmail.com",
            "password": "12345",
            "gender": "male",
            "country": "USA",
            "age": "28",
            "bio": "This is a sample bio",
            "stacks": ["python", "nodejs"]
        }
    });


    afterEach(async() => {
        server.close();
        await User.deleteMany({});
    });


    describe('GET /', () => {
        it('should return two newly created users', async() => {
            await createUsers();
            const res = await request(server).get('/api/users');

            //expect(res.body.length).toBe(2);
            expect(res.status).toBe(200);
            expect(res.body.some(user => user.name === "John Doe")).toBeTruthy()
                // expect(res.body.some(user => user.name === "Mary Doe")).toBeTruthy()

        });

        it('should return 404 if not user was found', async() => {
            const res = await request(server).get('/api/users');
            expect(res.status).toBe(404);
        });
    });



    describe('GET /:id', () => {
        it('should return two newly created users', async() => {
            //create a new user
            const user = await createUser();
            const res = await request(server).get(`/api/users/${user._id}`);

            expect(res.body).toHaveProperty('_id')
        });

        it('should return 404 if the user does not exist', async() => {
            //create a new user
            const res = await request(server).get(`/api/users/5e3c55532a6664408c2f8309`);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        it('should return 400 if invalid input were sent', async() => {
            //create a new user
            const res = await request(server).post(`/api/users/`).send({ "name": "John Doe" });
            expect(res.status).toBe(400)
        });

        it('should return 200 if a valid input were sent', async() => {
            //create a new user
            const res = await request(server).post(`/api/users/`).send(mockUser);
            expect(res.status).toBe(200)
        });


        it('should return new token if user was created', async() => {
            //create a new user
            const res = await request(server).post(`/api/users/`).send(mockUser);
            expect(res.header).toHaveProperty("x-auth-token")
        });


        it('should return new user object', async() => {
            //create a new user
            const res = await request(server).post(`/api/users/`).send(mockUser);
            expect(res.body).toHaveProperty("_id")
        });

    });


    describe('UPDATE /', () => {
        it('should return 200 if user was successfully updated', async() => {
            //create a new user
            const user_res = await request(server)
                .post(`/api/users/`)
                .send(mockUser);

            const token = user_res.header['x-auth-token'];
            const name = "Daniel";

            const res = await request(server)
                .patch(`/api/users/`)
                .set("x-auth-token", token)
                .send({ "name": name });

            expect(res.status).toBe(200)
            expect(res.body.name).toBe(name)
        });

        it('should return 400 if a valid input were sent', async() => {
            //create a new user
            const user_res = await request(server)
                .post(`/api/users/`)
                .send(mockUser);

            const token = user_res.header['x-auth-token'];
            const name = "";

            const res = await request(server)
                .patch(`/api/users/`)
                .set("x-auth-token", token)
                .send({ "name": name });

            expect(res.status).toBe(400)
        });


        // it('should return new token if user was created', async() => {
        //     //create a new user
        //     const res = await request(server).post(`/api/users/`).send(mockUser);
        //     expect(res.header).toHaveProperty("x-auth-token")
        // });


        // it('should return new user object', async() => {
        //     //create a new user
        //     const res = await request(server).post(`/api/users/`).send(mockUser);
        //     expect(res.body).toHaveProperty("_id")
        // });

    });

    describe('DELETE: /', () => {
        it('should return 200 if user was successfully deleted', async() => {
            //create a new user
            const user_res = await request(server)
                .post(`/api/users/`)
                .send(mockUser);

            const token = user_res.header['x-auth-token'];


            const res = await request(server)
                .delete(`/api/users/`)
                .set("x-auth-token", token)

            expect(res.status).toBe(200)
        });

    });



});