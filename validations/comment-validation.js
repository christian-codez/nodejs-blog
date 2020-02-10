const Joi = require('@hapi/joi');


const validateUpdateComment = (request) => {
    const schema = Joi.object({
        comment: Joi.string().required().min(5),
    });

    return schema.validate(request);
}


module.exports = {
    validateUpdateComment: validateUpdateComment,
};