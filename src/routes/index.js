const express = require("express");

const {
  register,
  login,
  resetPassword,
} = require("../controllers/AuthController");

const { checkAdmin, authenticateJWT } = require("../middleware");

const {
  index,
  show,
  destroy,
  update,
  showProfile,
  updateProfile,
  updateUserPassword,
  updateProfilePassword,
} = require("../controllers/UserController");
const AreaController = require("../controllers/AreaController");

const router = express.Router();

// auth
router.post("/login", login);
router.post("/register", register);
router.patch("/resetPassword", resetPassword);

// Admin
router.get("/admin/users", authenticateJWT, checkAdmin, index);
router.get("/admin/users/:id", authenticateJWT, checkAdmin, show);
router.patch("/admin/users/:id", authenticateJWT, checkAdmin, update);
router.patch(
  "/admin/users/:id/editPassword",
  authenticateJWT,
  checkAdmin,
  updateUserPassword
);
router.delete("/admin/users/:id", authenticateJWT, checkAdmin, destroy);

// Users
router.get("/users/profile", authenticateJWT, showProfile);
router.patch("/users/profile", authenticateJWT, updateProfile);
router.patch("/users/editPassword", authenticateJWT, updateProfilePassword);

// crowds
router.get("/areas", authenticateJWT, AreaController.index);
router.get("/areas/:id", authenticateJWT, AreaController.show);
router.post("/areas", authenticateJWT, checkAdmin, AreaController.store);
router.put("/areas/:id", authenticateJWT, checkAdmin, AreaController.update);
router.delete(
  "/areas/:id",
  authenticateJWT,
  checkAdmin,
  AreaController.destroy
);

router.get("/", (req, res) => {
  return res.status(200).send({
    message: "Hello world",
  });
});

module.exports = router;
