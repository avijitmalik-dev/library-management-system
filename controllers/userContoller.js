const { Sequelize, or } = require("sequelize");
const User = require("../models/user");

// Get all users
exports.getUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role:{
         [Sequelize.Op.ne]:"Admin", 
        }
      }
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
  try {
    if (!userId) {
      return res.status(204).json({ message: "userId are required" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }
    user.is_approved = true;
    user.role = role;

    await user.save();
    res.status(200).json({
      message: "User approved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//delete a user
exports.deleteUser = async(req, res)=>{
  const { userId } = req.params;
  if(!userId){
    res.status(204).json({ message:"UserId are required"});
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }  
    await user.destroy();
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Internal server error",
    })
  }
}