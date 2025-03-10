const Joi = require('joi');

// Joi schema for borrowing a book
const borrowBookSchema = Joi.object({
  bookId: Joi.number().integer().required().messages({
    'any.required': 'Book ID is required',
    'number.base': 'Book ID must be a number',
  }),
});

// Joi schema for returning a book
const returnBookSchema = Joi.object({
  bookId: Joi.number().integer().required().messages({
    'any.required': 'Book ID is required',
    'number.base': 'Book ID must be a number',
  }),
});

// Joi schema for recording a transaction
const recordTransactionSchema = Joi.object({
  userId: Joi.number().integer().required().messages({
    'any.required': 'User ID is required',
    'number.base': 'User ID must be a number',
  }),
  bookId: Joi.number().integer().required().messages({
    'any.required': 'Book ID is required',
    'number.base': 'Book ID must be a number',
  }),
  transactionType: Joi.string().valid('borrowed', 'returned').required().messages({
    'any.required': 'Transaction type is required',
    'string.base': 'Transaction type must be a string',
    'any.only': 'Transaction type must be either "borrowed" or "returned"',
  }),
});

module.exports = {
  borrowBookSchema,
  returnBookSchema,
  recordTransactionSchema,
};
