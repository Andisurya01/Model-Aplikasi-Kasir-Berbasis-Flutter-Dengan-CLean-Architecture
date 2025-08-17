// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Konfigurasi storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // folder simpan file

        // untuk jaga jaga bila memiliki beberapa kategori image
        // let folder = 'uploads/others';

        // if (req.baseUrl.includes('news')) {
        //     folder = 'uploads/news';
        // } else if (req.baseUrl.includes('talent') && file.fieldname === 'background') {
        //     folder = 'uploads/talent/background';
        // } else if (req.baseUrl.includes('talent') && file.fieldname === 'logo') {
        //     folder = 'uploads/talent/logo';
        // } else if (req.baseUrl.includes('talent') && file.fieldname === 'fullBody') {
        //     folder = 'uploads/talent/fullBody';
        // } else if (req.baseUrl.includes('talent') && file.fieldname === 'profilePicture') {
        //     folder = 'uploads/talent/profilePicture';
        // } else if (req.baseUrl.includes('talent')) {
        //     folder = 'uploads/talent/badge';
        // } else if (req.baseUrl.includes('staff')) {
        //     folder = 'uploads/staff';
        // } else if (req.baseUrl.includes('carousel')) {
        //     folder = 'uploads/carousel';
        // } else if (req.baseUrl.includes('sosmed')) {
        //     folder = 'uploads/sosmed';
        // } else if (req.baseUrl.includes('merch')) {
        //     folder = 'uploads/merch';
        // }

        // cb(null, folder);

    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // nama unik
    }
});

// Filter hanya gambar
function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
}

const upload = multer({ storage, fileFilter });

module.exports = upload;
