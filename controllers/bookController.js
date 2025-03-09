const sequelize = require("../config/dbConfig");
const Book = require("../models/book");
const { bookSchemas } = require("../validators/bookSchemas");


exports.createBook = async (req, res) => {
  const { title, author, isbn, availableCopies } = req.body;
  console.log(title, author, isbn, availableCopies);
  
  const { error, value } = bookSchemas.validate(req.body);


  if (error) {
    return res.status(400).json({
      message: "Validation errors",
      details: error.details,
    });
  }

  let transaction;
  try {
    transaction = await sequelize.transaction();
    const newBook = await Book.create(
      {
        title,
        author,
        isbn,
        availableCopies,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "Book created successfully",
      book: newBook,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({
      message: "Error creating book",
      error: error.message,
    });
  } finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};
