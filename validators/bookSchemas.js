const Joi = require("joi");

// create schema Validation 
const createBookSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Title is required",
    "string.min": "Title should have at least 3 characters",
    "string.max": "Title should have at most 100 characters",
  }),
  author: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Author is required",
    "string.min": "Author should have at least 3 characters",
    "string.max": "Author should have at most 100 characters",
  }),
  isbn: Joi.string().required().min(10).max(13).messages({
    "string.empty": "ISBN is required",
    "string.min": "ISBN should have at least 10 characters",
    "string.max": "ISBN should have at most 13 characters",
  }),
  availableCopies: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Available Copies should be a number",
    "number.min": "Available Copies cannot be negative",
    "number.default": "Available Copies defaults to 0 if not provided",
  }),
});


// update schema validation
const updateBookSchema  = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Title is required",
    "string.min": "Title should have at least 3 characters",
    "string.max": "Title should have at most 100 characters",
  }),
  author: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Author is required",
    "string.min": "Author should have at least 3 characters",
    "string.max": "Author should have at most 100 characters",
  }),
  availableCopies: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Available Copies should be a number",
    "number.min": "Available Copies cannot be negative",
    "number.default": "Available Copies defaults to 0 if not provided",
  }),
});

module.exports = { createBookSchema, updateBookSchema  };
