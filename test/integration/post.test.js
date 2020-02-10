/**
 * @jest-environment node
 */
const mongoose = require('mongoose');
const request = require('supertest');
const helpers = require("../../helpers/manage-tokens")
const { Post } = require("../../models/post");
const { User } = require("../../models/user");

let mockUser, post, server;

const createPost = async() => {
    const user = await createUser();
    const token = helpers.generateToken(user);

    await request(server)
        .post(`/api/posts/`)
        .set("x-auth-token", token)
        .send(post);

}
const createUser = async() => {
    const user = new User(mockUser);
    return await user.save();
}

describe('/api/posts/', () => {

    beforeEach(async() => {
        server = require("../../app");
        post = {
            "title": "sample title 1",
            "content": "sample content"
        };

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
        await server.close();
        await User.deleteMany({});
        await Post.deleteMany({});

    });

    describe('GET: /', () => {
        it('should return 200 if a post was found', async() => {
            //create a mock post
            await createPost()
            const res = await request(server).get(`/api/posts/`);
            //var id = mongoose.Types.ObjectId();
            expect(res.status).toBe(200);
        });

        it('should return 404 if no post was found', async() => {
            const res = await request(server).get(`/api/posts/`);
            console.log(res.body);

            expect(res.status).toBe(404);
        });
    });


    describe('POST: /', () => {
        it('should return 200 if a post was found', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);

            //create a mock post
            const res = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);

            //var id = mongoose.Types.ObjectId();
            expect(res.status).toBe(200);
        });

        it('should return 400 if invalid data was provided.', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);

            //create a mock post
            const res = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send({});

            expect(res.status).toBe(400);
        });
    });


    describe('SEARCH: /', () => {
        it('should return 400 if keyword was not provided', async() => {

            //UPDATE POST
            const res = await request(server)
                .get(`/api/posts/search`)
                .send();

            //var id = mongoose.Types.ObjectId();
            expect(res.status).toBe(400);
        });

        it('should return 404 if keyword was not provided', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);
            post = { "title": "abcdef", "content": "This is a sample content." };

            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);


            const res = await request(server)
                .get(`/api/posts/search?s=notfound`)
                .send();

            // //var id = mongoose.Types.ObjectId();
            expect(res.status).toBe(404);
        });


        it('should return 200 if keyword was found', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);
            post = { "title": "abcdef", "content": "This is a sample content." };

            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);


            const res = await request(server)
                .get(`/api/posts/search?s=abcdef`)
                .send();

            // //var id = mongoose.Types.ObjectId();
            expect(res.status).toBe(200);
        });

    });


    describe('PATCH: /', () => {
        it('should return 200 if a post was updated successfully', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);
            const newTitle = "New title";
            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);

            //UPDATE POST
            const res = await request(server)
                .patch(`/api/posts/${posts.body._id}`)
                .set("x-auth-token", token)
                .send({ "title": newTitle });

            //var id = mongoose.Types.ObjectId();
            expect(res.status).toBe(200);
            expect(res.body.title).toBe(newTitle);
        });

        it('should return a valid post object if a post was updated successfully', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);
            const newTitle = "New title";
            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);

            //UPDATE POST
            const res = await request(server)
                .patch(`/api/posts/${posts.body._id}`)
                .set("x-auth-token", token)
                .send({ "title": newTitle });

            //var id = mongoose.Types.ObjectId();
            expect(res.body.title).toBe(newTitle);
        });


        it('should return 400 if an invalid input was sent', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);
            const newTitle = "";
            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);

            //UPDATE POST
            const res = await request(server)
                .patch(`/api/posts/${posts.body._id}`)
                .set("x-auth-token", token)
                .send({ "title": newTitle });

            //var id = mongoose.Types.ObjectId();
            expect(res.status).toBe(400);
        });


        it('should return 400 if an invalid post ID was passed', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);
            const newTitle = "New title";
            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);

            //UPDATE POST
            const res = await request(server)
                .patch(`/api/posts/1234`)
                .set("x-auth-token", token)
                .send({ "title": newTitle });

            //const noExistingId = mongoose.Types.ObjectId();
            expect(res.status).toBe(400);
        });

        it('should return 400 if a non existent post ID was passed', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);
            const newTitle = "New title";
            const noExistingId = mongoose.Types.ObjectId();

            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);

            //UPDATE POST
            const res = await request(server)
                .patch(`/api/posts/${noExistingId}`)
                .set("x-auth-token", token)
                .send({ "title": newTitle });

            //const noExistingId = mongoose.Types.ObjectId();
            expect(res.status).toBe(400);
        });


    });


    describe('DELETE: /', () => {

        it('should return 400 if an invalid user ID was sent', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);

            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);

            //delete post
            const res = await request(server)
                .delete(`/api/posts/1111`)
                .set("x-auth-token", token)

            expect(res.status).toBe(400);
        });

        it('should return 400 if a post was not deleted.', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);
            const noExistingId = mongoose.Types.ObjectId();

            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);

            //delete post
            const res = await request(server)
                .delete(`/api/posts/${noExistingId}`)
                .set("x-auth-token", token)

            expect(res.status).toBe(400);
        });

        it('should return 200 if a post was deleted.', async() => {
            const user = await createUser();
            const token = helpers.generateToken(user);
            const noExistingId = mongoose.Types.ObjectId();

            //create a mock post
            const posts = await request(server)
                .post(`/api/posts/`)
                .set("x-auth-token", token)
                .send(post);

            //delete post
            const res = await request(server)
                .delete(`/api/posts/${posts.body._id}`)
                .set("x-auth-token", token)

            expect(res.status).toBe(200);
        });
    });

});