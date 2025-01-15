const checkAdmin = require("./checkAdmin");
const authenticateJWT = require("./authenticateJWT");
const uploadPhotosMiddleware = require("./uploadPhotosMiddleware");

module.exports = { checkAdmin, authenticateJWT, uploadPhotosMiddleware };
