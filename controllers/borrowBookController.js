const Book = require("../models/books");
const BorrowedBooks = require("../models/borrowedBooks");
const User = require("../models/users");
const sequelize = require('../config/dbConfig');
const { borrowBookSchema, returnBookSchema, recordTransactionSchema } = require('../validators/borrowSchemas');

// borrowBook
exports.borrowBook = async (req, res) => {
  const { error } = borrowBookSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { bookId } = req.body;
  const userId = req.user.userId;

  let transaction;
  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(204).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(204).json({ message: 'No available copies of the book' });
    }

    
    // Create a borrowing record within a transaction
    transaction = await sequelize.transaction();

    const borrowRecord = await BorrowedBooks.create({
      userId,
      bookId,
      borrowDate: new Date(),
    }, { transaction });

    book.availableCopies -= 1;
    await book.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      message: 'Book borrowed successfully',
      borrowRecord,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};

// returnBook
exports.returnBook = async (req, res) => {
  const { error } = returnBookSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { bookId } = req.body;
  const userId = req.user.userId;
  console.log(bookId, userId);
  
 let transaction;
  try {
    const borrowRecord = await BorrowedBooks.findOne({
      where: { userId, bookId, status: 'borrowed' },
    });

    if (!borrowRecord) {
      return res.status(204).json({ message: 'You have not borrowed this book' });
    }
    transaction = await sequelize.transaction();
    borrowRecord.returnDate = new Date();
    await borrowRecord.save({ transaction });

    const book = await Book.findByPk(bookId);
    book.availableCopies += 1;
    await book.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      message: 'Book returned successfully',
      borrowRecord,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};

// recordTransaction
exports.recordTransaction = async (req, res) => {
  const { error } = recordTransactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { userId, bookId, transactionType } = req.body;
  let transaction;

  try {
    if (!["borrowed", "returned"].includes(transactionType)) {
      return res.status(400).json({
        message: "Invalid transaction type. Must be 'borrowed' or 'returned'.",
      });
    }

    // Start a transaction to ensure atomic operations
    transaction = await sequelize.transaction();

    const book = await Book.findByPk(bookId, { transaction });
    const user = await User.findByPk(userId, { transaction });

    if (!book || !user) {
      return res.status(204).json({ message: "Book or User not found" });
    }

    const borrowRecord = await BorrowedBooks.create(
      {
        userId,
        bookId,
        status: transactionType,
        borrowDate: transactionType === "borrowed" ? new Date() : null,
        returnDate: transactionType === "returned" ? new Date() : null,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "Transaction recorded successfully",
      data: borrowRecord,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: "Error recording transaction", error: error.message });
  } finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};

// member get all books borrow/return
exports.getMemberRecords = async (req, res) => {
  const userId = req.user.userId;
  const { startDate, endDate, search } = req.query;
  
  let dateFilter = {};
  if (startDate || endDate) {
    if (startDate && isNaN(new Date(startDate).getTime())) {
      return res.status(400).json({ message: 'Invalid start date format.' });
    }
    if (endDate && isNaN(new Date(endDate).getTime())) {
      return res.status(400).json({ message: 'Invalid end date format.' });
    }

    if (startDate) {
      dateFilter.borrowDate = { [sequelize.Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      dateFilter.borrowDate = { 
        ...dateFilter.borrowDate,
        [sequelize.Op.lte]: new Date(endDate)
      };
    }
  }

  let searchFilter = {};
  if (search) {
    searchFilter = {
      [sequelize.Op.or]: [
        { '$Book.title$': { [sequelize.Op.like]: `%${search}%` } },
        { '$Book.author$': { [sequelize.Op.like]: `%${search}%` } },
      ]
    };
  }

  try {
    const borrowRecords = await BorrowedBooks.findAll({
      where: { 
        userId,
        ...dateFilter,
      },
      include: [
        {
          model: Book,
          attributes: ['book_id', 'title', 'author'],
          where: searchFilter,
        }
      ],
      order: [['updatedAt', 'DESC']],
    });

    if (borrowRecords.length === 0) {
      return res.status(204).json({ message: 'No borrow records found for this member.' });
    }    
    res.status(200).json({
      message: 'Borrow/Return records fetched successfully',
      data: borrowRecords,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// book wise librarians check record
exports.getBookRecord = async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const borrowRecords = await BorrowedBooks.findAll({
      where: { bookId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'name', 'email'],
        }
      ],
      order: [['updatedAt', 'DESC']],
    });

    if (borrowRecords.length === 0) {
      return res.status(204).json({ message: 'No borrow records found for this book.' });
    }

    res.status(200).json({
      message: 'Book borrow/return records fetched successfully',
      data: borrowRecords,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
