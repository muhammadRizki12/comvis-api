const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

// Middleware untuk memverifikasi token
const authenticateJWT = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        mesage: "Token required",
      });
    }

    // Ambil token dari headers
    const token = authorization.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    // decode token
    const jwtDecode = jwt.verify(token, secret);
    req.user = jwtDecode;
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  next();
};

module.exports = authenticateJWT;
