const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
 
    if (!token) {
      return res.status(401).json({ message: "Token not found" + token });
    }

    const decodedObj = jwt.verify(token, "Dev@tarun");
    const userId = decodedObj.id; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request for later use
    req.user = user;

    // Proceed to next middleware or route
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

module.exports = { userAuth };
