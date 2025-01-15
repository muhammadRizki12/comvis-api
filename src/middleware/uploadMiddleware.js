const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.body?.id || "default";

    const uploadDir = path.join(
      __dirname,
      "../public/images",
      userId.toString()
    ); // Perhatikan path ke folder uploads

    // Buat folder 'uploads' jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
