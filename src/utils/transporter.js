const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // TLS (SSL)
    secure: true, // gunakan true untuk port 465
    auth: {
        user: process.env.EMAIL_USER, // contoh: myapp@gmail.com
        pass: process.env.EMAIL_PASS, // App Password 16 digit
    },
});

