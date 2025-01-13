const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

// Middleware untuk memverifikasi token
const authenticateJWT = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Token required!");
    }

    // Ambil token dari headers
    const token = authorization.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    // decode token
    const jwtDecode = jwt.verify(token, secret);
    req.user = jwtDecode;
    next();
  } catch (error) {
    res.status(error.code || 400).send({
      message: error.message,
    });
  }
};

module.exports = authenticateJWT;
