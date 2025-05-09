// backend/utils/upload.utils.js

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Use ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "../../public/uploads");

    // Ensure directory exists
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Safely get extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPEG, PNG & GIF allowed."));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
