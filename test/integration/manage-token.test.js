const { User } = require("../../models/user");
const helpers = require("../../helpers/manage-tokens");

describe('manage-tokens: ', () => {

    it('return false if invalid user object was passed', () => {
        const res = helpers.generateToken({});
        expect(res).toBeFalsy();
    });

    it('return true if a valid user object was passed', () => {
        let user = new User({
            "name": "John Doe",
            "email": "test1@gmail.com",
            "password": "12345",
            "gender": "male",
            "country": "USA",
            "age": "28",
            "bio": "This is a sample bio",
            "stacks": ["python", "nodejs"]
        });
        user.save().then(data => user = data)

        const res = helpers.generateToken(user);
        expect(res).toBeTruthy();
    });
});



// beforeEach(() => {
//     mockUser = {
//         "name": "John Doe",
//         "email": "test1@gmail.com",
//         "password": "12345",
//         "gender": "male",
//         "country": "USA",
//         "age": "28",
//         "bio": "This is a sample bio",
//         "stacks": ["python", "nodejs"]
//     }
// });


// afterEach(async() => {
//     await User.deleteMany({});
// });


// describe('Creating Token: ', () => {
//     it('should return false if an invalide user object was passed', async() => {
//         const user = await createUser();

//         console.log(user)
//     });
// });