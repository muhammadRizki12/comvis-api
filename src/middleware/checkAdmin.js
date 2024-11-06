const checkAdmin = (req, res, next) => {
  try {
    // Cek apakah user memiliki role admin
    if (req.user.role !== "admin") {
      throw new Error("Forbidden - Admin access required");
    }
    next();
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = checkAdmin;
