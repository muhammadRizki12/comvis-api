const checkAdmin = require("./checkAdmin");
const authenticateJWT = require("./authenticateJWT");
const uploadMiddleware = require("./uploadMiddleware");

module.exports = { checkAdmin, authenticateJWT, uploadMiddleware };
