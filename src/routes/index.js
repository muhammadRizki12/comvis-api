const express = require("express");
const { register, login } = require("../controllers/AuthController");

const router = express.Router();

// auth
router.post("/login", login);
router.post("/register", register);

module.exports = router;
