const multer = require('multer');

// Create a multer instance
const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024, // 4MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Supported file extensions
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];

        // Check if the file extension is allowed
        const extension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
        if (allowedExtensions.includes(extension)) {
            // Pass the file to the next middleware
            cb(null, true);
        } else {
            // Reject the file with an error message
            cb(new Error('Invalid file extension. Only JPG, JPEG, and PNG files are allowed.'));
        }
    },
});

module.exports = upload;