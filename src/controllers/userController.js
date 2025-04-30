const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { json } = require("express");

const prisma = new PrismaClient();

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exixtsingUser = await prisma.user.findUnique({ where: { email } });
    if (exixtsingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.log("An unexpected error occurred:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid credits" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: token, user: user });
  } catch (error) {
    console.log("An errored while sign in: " + error.message);
    return res.status(501).json({ message: "An internal server occured" });
  }
};

exports.getProfile = async (req, res) => {
  const user = req.user;

  res.json({
    message: "user profile loaded",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
