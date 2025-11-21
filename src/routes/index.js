const express = require("express");

const AuthController = require("../controllers/AuthController");

const {
  checkAdmin,
  authenticateJWT,
  uploadPhotosMiddleware,
} = require("../middleware");

const UserController = require("../controllers/UserController");
const AreaController = require("../controllers/AreaController");
const CrowdController = require("../controllers/CrowdController");
const FatigueController = require("../controllers/FatigueController");

const router = express.Router();

// auth
router.post("/login", AuthController.login);
router.post(
  "/register",
  uploadPhotosMiddleware.upload.array("photos"),
  AuthController.register
);
router.patch("/resetPassword", AuthController.resetPassword);

// Admin
router.get("/admin/users", authenticateJWT, checkAdmin, UserController.index);
router.get(
  "/admin/users/:id",
  authenticateJWT,
  checkAdmin,
  UserController.show
);
router.patch(
  "/admin/users/:id",
  authenticateJWT,
  checkAdmin,
  UserController.update
);
router.patch(
  "/admin/users/:id/editPassword",
  authenticateJWT,
  checkAdmin,
  UserController.updateUserPassword
);
router.delete(
  "/admin/users/:id",
  authenticateJWT,
  checkAdmin,
  UserController.destroy
);

// Users
router.get("/users/profile", authenticateJWT, UserController.showProfile);
router.patch("/users/profile", authenticateJWT, UserController.updateProfile);
router.patch(
  "/users/editPassword",
  authenticateJWT,
  UserController.updateProfilePassword
);

// areas
router.get("/areas", authenticateJWT, AreaController.index);
router.get("/areas/:id", authenticateJWT, AreaController.show);
router.get(
  "/areas/users/:user_id",
  authenticateJWT,
  AreaController.areaByUserId
);
router.post("/areas", authenticateJWT, AreaController.store);
router.put("/areas/:id", authenticateJWT, AreaController.update);
router.delete("/areas/:id", authenticateJWT, AreaController.destroy);

// crowds
router.get("/crowds", authenticateJWT, CrowdController.index);
router.post("/crowds", authenticateJWT, CrowdController.store);
router.get("/crowds/:area_id", authenticateJWT, CrowdController.show);
router.get(
  "/crowds/users/:user_id",
  authenticateJWT,
  CrowdController.crowdByUserId
);

// fatigue
router.get("/fatigues", authenticateJWT, FatigueController.index);
router.get("/fatigues/users/:user_id", authenticateJWT, FatigueController.show);
router.post("/fatigues", authenticateJWT, FatigueController.store);

router.get("/", (req, res) => {
  return res.render("fatigue");
});

module.exports = router;
