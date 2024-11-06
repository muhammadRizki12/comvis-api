const express = require("express");
const {
  register,
  login,
  resetPassword,
} = require("../controllers/AuthController");

// const authenticateJWT = require("../middleware/authenticateJWT");
// const checkAdmin = require("../middleware/checkAdmin");
const { checkAdmin, authenticateJWT } = require("../middleware");

const {
  showProfile,
  editUserProfile,
  editPassword,
  showAllUsers,
} = require("../controllers/UserController");

const router = express.Router();

// auth
router.post("/login", login);
router.post("/register", register);
router.patch("/resetPassword", resetPassword);

router.get("/admin/users", authenticateJWT, checkAdmin, showAllUsers);
router.delete("/admin/users", authenticateJWT, checkAdmin, showAllUsers);

router.get("/users/profile", authenticateJWT, showProfile);
router.patch("/users/profile", authenticateJWT, editUserProfile);
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
