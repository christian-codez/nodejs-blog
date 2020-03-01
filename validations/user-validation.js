const Joi = require('@hapi/joi');


const validateUserCreation = (request) => {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
        email: Joi.string().required().regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/),
        password: Joi.string().required().min(5).max(255),
        gender: Joi.string().valid("male", "female", "rather not say"),
        country: Joi.string(),
        age: Joi.string(),
        stacks: Joi.array().items(Joi.string()),
        bio: Joi.string(),
        verified: Joi.string(),
    });

    return schema.validate(request);
}

const validateUserUpdate = (request) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255),
        email: Joi.string().regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/),
        password: Joi.string().min(5).max(255),
        gender: Joi.string().valid("male", "female", "rather not say"),
        country: Joi.string(),
        age: Joi.string(),
        stacks: Joi.array().items(Joi.string()),
        bio: Joi.string(),
    });

    return schema.validate(request);
}

module.exports = {
    validateUserCreation: validateUserCreation,
    validateUserUpdate: validateUserUpdate,

};