const Books = require("../models/books");
const Users = require("../models/users");
const BorrowedBooks = require("../models/borrowedBooks");

// A User can borrow many books through BorrowedBooks
Users.hasMany(BorrowedBooks, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
BorrowedBooks.belongsTo(Users, {
  foreignKey: "userId",
});

// A Book can be borrowed by many users through BorrowedBooks
Books.hasMany(BorrowedBooks, {
  foreignKey: "bookId",
  onDelete: "CASCADE",
});
BorrowedBooks.belongsTo(Books, {
  foreignKey: "bookId",
});

module.exports = { Books, Users, BorrowedBooks };
