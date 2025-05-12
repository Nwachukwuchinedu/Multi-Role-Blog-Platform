import multer from "multer";
import path from "path";
// Set up storage engine
const storage = multer.memoryStorage(); // Store as buffer for Supabase upload

// File filter (optional)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error("Images only!"));
};

 const upload = multer({ storage, fileFilter });
 
 export {upload}
