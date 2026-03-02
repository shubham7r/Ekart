import multer from "multer";

/* ================= STORAGE ================= */
// Store file in memory (required for Cloudinary upload)
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
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/* ================= EXPORTS ================= */
// ✅ must match frontend formData.append("profilePic", file)
export const singleUpload = upload.single("profilePic");

// optional multiple images
export const multipleUpload = upload.array("images", 5);
