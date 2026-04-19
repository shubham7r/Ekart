import multer from "multer";

// ================= STORAGE =================
const storage = multer.memoryStorage();

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// ================= MULTER INSTANCE =================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
});

// ================= SINGLE FILE UPLOAD =================
export const singleUpload = (req, res, next) => {
  upload.single("profilePic")(req, res, (err) => {
    if (err) {
      console.log("MULTER ERROR:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next();
  });
};

// ================= MULTIPLE FILE UPLOAD =================
// ⚠️ MUST MATCH FRONTEND: formData.append("productImg", file)
export const multipleUpload = (req, res, next) => {
  upload.array("productImg", 5)(req, res, (err) => {
    if (err) {
      console.log("MULTER ERROR:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // 🔥 Debug logs (very useful)
    console.log("FILES RECEIVED:", req.files);

    next();
  });
};

export default upload;
