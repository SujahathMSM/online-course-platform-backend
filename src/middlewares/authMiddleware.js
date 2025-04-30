const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authenticationToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; //Bearer Token
  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //attach user info to request
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid User" });
    }


    //user is now available in all protected routes
    req.user = user;

    //continue to next middleware or controller
    next();
  } catch (error) {
    console.log("An error occured: " + error.message);
    return res.status(403).json({ message: "Invlaid or Expired token" });
  }
};

module.exports = authenticationToken
