/**
 * @jest-environment node
 */

const request = require('supertest');
const { User } = require("../../models/user");
const { Post } = require("../../models/post");
const helpers = require("../../helpers/manage-tokens")

let server, mockUser;

const createPost = async() => {
    const user = await createUser();
    //create comment
    let post = new Post({
        'title': 'sample title',
        'content': 'sample content.',
        'author': user._id,
        'comments': [{
            comment: 'sample comment',
            user: user._id
        }, {
            comment: 'sample comment 2',
            user: user._id
        }]
    });

    post = await post.save();

    return post;
}


const createPostOnly = async() => {
    const user = await createUser();
    //create comment
    let post = new Post({
        'title': 'sample title',
        'content': 'sample content.',
        'author': user._id,
    });

    post = await post.save();

    return post;
}




const createUser = async() => {
    const user = new User(mockUser);
    return await user.save();
}


describe('/api/comments', () => {

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
        await server.close();
        await User.deleteMany({});
        await Post.deleteMany({});

    });

    describe('GET /', () => {

        it('should return 200 if a comment is created', async() => {
            const post = await createPost(); //create a mock post
            const res = await request(server).get(`/api/comments/${post._id}`);

            expect(res.status).toBe(200);
        });

        it('should return 400 if no comment was found.', async() => {
            const res = await request(server).get(`/api/comments/5e3c7b6068a67544b013db3c`);

            expect(res.status).toBe(400);
        });
    });

    describe('POST /', () => {

        it('should return 400 if an invalid comment was sent', async() => {
            const user = await createUser(); //generate mock user
            const token = helpers.generateToken(user) //generate sample token

            const res = await request(server)
                .post(`/api/comments/5e3c7b6068a67544b013db3c`)
                .set("x-auth-token", token)
                .send({});

            expect(res.status).toBe(400);
        });

        it('should return 200 if comment was created', async() => {
            //dummy user
            let user = await request(server)
                .post(`/api/users/`)
                .send({
                    "name": "John Doe",
                    "email": "test12@gmail.com",
                    "password": "12345",
                    "gender": "male",
                    "country": "USA",
                    "age": "28",
                    "bio": "This is a sample bio",
                    "stacks": ["python", "nodejs"]
                });

            const token = user.header['x-auth-token'];

            //dummy post
            const post = await request(server)
                .post("/api/posts/")
                .set("x-auth-token", token)
                .send({
                    'title': 'sample title',
                    'content': 'sample content.',
                });

            const res = await request(server)
                .post(`/api/comments/${post.body._id}`)
                .set("x-auth-token", token)
                .send({ "comment": "Sample xomment" });

            expect(res.status).toBe(200);
        });


    });



});