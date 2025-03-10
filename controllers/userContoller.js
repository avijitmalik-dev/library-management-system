const { Sequelize, or } = require("sequelize");
const User = require("../models/users");
const BorrowedBooks = require("../models/borrowedBooks");
const Book = require("../models/books");
const sequelize = require("../config/dbConfig");

// Get all users
exports.getUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: {
          [Sequelize.Op.ne]: "Admin",
        },
      },
    });
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get unapproved users
exports.getUnapprovedUser = async (req, res) => {
  try {
    const unapprovedUsers = await User.findAll({
      where: { is_approved: false },
    });
    res.status(200).json({
      message: "Unapproved users fetched successfully",
      data: unapprovedUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Approve a user
exports.approveUser = async (req, res) => {
  const { userId, role } = req.params;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }

    user.is_approved = true;
    user.role = role;
    await user.save({ transaction });
    await transaction.commit();

    res.status(200).json({
      message: "User approved successfully",
      data: user,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  } finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  let transaction;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    transaction = await sequelize.transaction();
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }
    await user.destroy({ transaction });
    await transaction.commit();
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  } finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};


//get user all record
exports.getUserRecord = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({
      where: { user_id: userId },
      include: [
        {
          model: BorrowedBooks,
          include: [
            {
              model: Book,
              attributes: ['book_id', 'title', 'author'],
            }
          ],
          attributes: ['borrowDate', 'returnDate', 'status'],
        }
      ],
    });

    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User record fetched successfully",
      data: user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};