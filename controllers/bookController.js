const sequelize = require("../config/dbConfig");
const Book = require("../models/book");
const createBookSchema = require("../validators/bookSchemas");
const { Op } = require('sequelize');


// create book
exports.createBook = async (req, res) => {
  const data = req.body; 
  let booksToCreate = [];
  
  if (Array.isArray(data)) {
    booksToCreate = data;
  } else if (typeof data === 'object') {
    booksToCreate = [data];
  } else {
    return res.status(400).json({
      message: "Invalid data.",
    });
  }

  // Validate each book in the array
  const validationErrors = booksToCreate.map(book => {
    const { error } = createBookSchema.validate(book);
    return error;
  }).filter(error => error !== undefined);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      message: "Validation errors",
      details: validationErrors,
    });
  }

  let transaction;
  try {
    transaction = await sequelize.transaction();

    const createdBooks = [];
    for (let book of booksToCreate) {
      const { title, author, availableCopies } = book;
      const uniqueISBN = `LMS-${Date.now()}`;
      const newBook = await Book.create(
        {
          title,
          author,
          isbn: uniqueISBN,
          availableCopies,
        },
        { transaction }
      );
      
      createdBooks.push(newBook);
    }
    await transaction.commit();
    res.status(201).json({
      message: "Books created successfully",
      data: createdBooks,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({
      message: "Error creating books",
      error: error.message,
    });
  } finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};


// get boooks
exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    console.log(author, startDate, endDate);

    // Build query options
    const queryOptions = {
      offset,
      limit,
      order: [['updatedAt', 'DESC']],
      where: {},
    };

    // Add author filter 
    if (author) {
      queryOptions.where.author = { [Op.like]: `%${author}%` };
    }

    // filter
    if (startDate && endDate) {
      queryOptions.where.updatedAt = {
        [Op.gte]: new Date(startDate),
        [Op.lte]: new Date(endDate),
      };
    } else if (startDate) {
      // Only startDate is provided
      queryOptions.where.updatedAt = {
        [Op.gte]: new Date(startDate),
      };
    } else if (endDate) {
      // Only endDate is provided
      queryOptions.where.updatedAt = {
        [Op.lte]: new Date(endDate),
      };
    }

    // Execute the query
    const books = await Book.findAll(queryOptions);
    const totalBooks = await Book.count();
    const totalPages = Math.ceil(totalBooks / limit);

    // Return data
    res.status(200).json({
      message: "Books fetched successfully",
      data: books,
      pagination: {
        page,
        limit,
        totalBooks,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



// update book 
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, availableCopies } = req.body;
console.log( title, author, availableCopies , id);


  const { error } = createBookSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation errors",
      details: error.details,
    });
  }

  let transaction;
  try {
    transaction = await sequelize.transaction();

    // Find the book by primary key (id)
    console.log(id);
    
    const book = await Book.findByPk(id, { transaction });
    if (!book) {
      return res.status(204).json({ message: "Book not found" });
    }

    // Create an update object
    const updatedBookData = {
      title,
      author,
      availableCopies,
    };

    // Update the book using the object format
    await book.update(updatedBookData, { transaction });

    await transaction.commit();

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBookData,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({
      message: "Error updating book",
      error: error.message,
    });
  } finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};



// delete book
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  let transaction;
  try {

    transaction = await sequelize.transaction();
    const book = await Book.findByPk(id, { transaction });
    if (!book) {
      return res.status(204).json({ message: "Book not found" });
    }
    await book.destroy({ transaction });
    await transaction.commit();
    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({
      message: "Error deleting book",
      error: error.message,
    });
  } finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};


