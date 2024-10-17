const express = require("express");
const { register, login } = require("../controllers/AuthController");
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

// auth
router.post("/login", login);
router.post("/register", register);

// Endpoint yang dilindungi
router.get("/test", authenticateJWT, async (req, res) => {
  res.status(200).send({
    user: req.userData,
  });
});

module.exports = router;
