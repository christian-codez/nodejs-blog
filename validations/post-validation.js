const Joi = require('@hapi/joi');


const validateNewPost = (request) => {
    const schema = Joi.object({
        title: Joi.string().required().min(5).max(50),
        content: Joi.string().required().min(5),
    });

    return schema.validate(request);
}

const validateUpdatedPost = (request) => {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50),
        content: Joi.string().min(5),
    });

    return schema.validate(request);
}




module.exports = {
    validateNewPost: validateNewPost,
    validateUpdatedPost: validateUpdatedPost
};