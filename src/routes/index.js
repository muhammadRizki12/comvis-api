const express = require("express");
const {
  register,
  login,
  resetPassword,
} = require("../controllers/AuthController");
const authenticateJWT = require("../middleware/authenticateJWT");
const {
  showProfile,
  editUserProfile,
  editPassword,
} = require("../controllers/UserController");

const router = express.Router();

// auth
router.post("/login", login);
router.post("/register", register);
router.patch("/resetPassword", resetPassword);

router.get("/users", authenticateJWT, showProfile);
router.patch("/users", authenticateJWT, editUserProfile);
router.patch("/users/editPassword", authenticateJWT, editPassword);

router.get("/", (req, res) => {
  return res.status(200).send({
    message: "Hello world",
  });
});

// Endpoint yang dilindungi
router.get("/test", authenticateJWT, async (req, res) => {
  res.status(200).send({
    user: req.user,
  });
});

module.exports = router;
