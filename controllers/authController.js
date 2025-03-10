const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { generateSecurePassword } = require("../services/passwordService");
const { sendPasswordEmail } = require("../services/emailService");
const { registerSchema, loginSchema } = require("../validators/authSchemas"); 

// Generate JWT tokens
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '10h' });
};



// Register user
exports.registerUser = async (req, res) => {
  const { name, email, phone } = req.body;
  
  // Validate input 
  const { error } = registerSchema.validate({ name, email, phone });
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const generatedPassword = generateSecurePassword(name, email, phone);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await sendPasswordEmail(email, generatedPassword);
    res.status(201).json({ 
      message: "User registered successfully. Password sent to email." 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error registering user", error: error.message 
    });
  }
};


// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const userPayload = { userId: user.user_id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(userPayload);

    res.status(200).json({
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
