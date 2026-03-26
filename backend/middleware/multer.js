import multer from "multer";

/* ================= STORAGE ================= */
const storage = multer.memoryStorage();

/* ================= FILE FILTER ================= */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/* ================= MULTER INSTANCE ================= */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/* ================= WRAPPED EXPORTS ================= */

// ✅ SINGLE FILE
export const singleUpload = (req, res, next) => {
  upload.single("profilePic")(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

// ✅ MULTIPLE FILES
export const multipleUpload = (req, res, next) => {
  upload.array("images", 5)(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};
