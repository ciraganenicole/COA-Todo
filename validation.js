import Joi from 'joi';

const validation = Joi.object({

  id: Joi.number().integer().optional().messages({
    'number.base': 'Id should be a number',
    'number.empty': 'Id cannot be empty',
    'number.integer': 'Id should be an integer',
    'any.required': 'Id is a required',
  }),

  title: Joi.string().required()
    .messages({
      'string.base': 'Title should be a string',
      'string.empty': 'Title cannot be empty',
      'any.required': 'Title is a required',
    }),
  description: Joi.string().required()
    .messages({
      'string.base': 'Description should be a string',
      'string.empty': 'Description cannot be empty',
      'any.required': 'Description is a required',
    }),

  isCompleted: Joi.boolean().optional().messages({
    'boolean.base': 'isCompleted should be a boolean',
    'any.required': 'isCompleted is a required',
  }),

  isDeleted: Joi.boolean().optional().messages({
    'boolean.base': 'isDeleted should be a boolean',
    'any.required': 'isDeleted is a required',
  }),

  date: Joi.date(),
});

export default validation;
