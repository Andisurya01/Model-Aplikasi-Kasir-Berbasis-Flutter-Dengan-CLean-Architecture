const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SALT = 10;
const userRepository = require('../repositories/userRepository');
const ApplicationError = require('../../config/errors/ApplicationError');
const { transporter } = require('../utils/transporter');


const JWT_SECRET_KEYY = "SKRIPSIGACOR";
const TOKEN_EXPIRATION = '10h'; // Token valid selama 1 jam

const encryptedPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, SALT);
        return hash;
    } catch (err) {
        throw new Error(err);
    }
};

const checkPassword = async (password, hash) => {
    try {
        const result = await bcrypt.compare(password, hash);
        return result;
    } catch (err) {
        throw new Error(err);
    }
};

const createToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET_KEYY, { expiresIn: TOKEN_EXPIRATION });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEYY);
        return decoded;
    } catch (err) {
        console.error('Token tidak valid:', err.message);
        return null;
    }
};

const authorize = async (bearerToken) => {
    try {
        if (!bearerToken) {
            throw new ApplicationError('Unauthorized', 401);
        }
        const token = bearerToken.split("Bearer ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            throw new ApplicationError('Unauthorized', 401);
        }

        const { id } = decoded;
        const user = await userRepository.findUserById(id);


        if (!user) {
            throw new ApplicationError('Unauthorized', 401);
        }

        return user;
    } catch (err) {
        throw new ApplicationError(err.message, err.statusCode || 500);
    }
};

const login = async (email, password) => {
    try {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new ApplicationError('User not found', 404);
        }

        const isPasswordMatch = await checkPassword(password, user.password);

        if (!isPasswordMatch) {
            throw new ApplicationError('Wrong Password', 401);
        }

        const token = createToken({ id: user.id });
        return {
            user,
            token
        };
    } catch (err) {
        throw new ApplicationError(err.message, err.statusCode || 500);
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Successfully logged out' });
};

const generateOtp = async (email) => {
    try {
        const response = await userRepository.findUserByEmail(email);

        if (!response) {
            throw new ApplicationError('User not found', 404);
        }
        const userId = response.id;
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        const createotp = await userRepository.saveOtp(otpCode, expiresAt, userId);

        if (!createotp) {
            throw new ApplicationError('Failed to create OTP', 500);
        }
        const resetLink = `http://myapp.com/reset?otp=${otpCode}&email=${email}`;

        const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #2563EB;">Reset Password Request</h2>
      <p>Use this OTP code to reset your password:</p>
      <h1 style="letter-spacing: 5px;">${otpCode}</h1>
      <p>Or click the link below:</p>
      <p>This code will expire in 5 minutes.</p>
    </div>
  `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            html: htmlTemplate
        });
        return otpCode;
    } catch (err) {
        throw new ApplicationError(err.message, err.statusCode || 500);
    }
};

const verifyOtp = async (email, code) => {
    try {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new ApplicationError('User not found', 404);
        }
        const otpRecord = await userRepository.findOtp(code);
        if (!otpRecord) {
            throw new ApplicationError('Invalid OTP', 401);
        }

        if (otpRecord.expiresAt < new Date()) {
            throw new ApplicationError('OTP expired', 400);
        }

        if (otpRecord.attempts >= 3) {
            throw new ApplicationError('Too many attempts', 400);
        }

        await userRepository.incrementOtpAttempts(otpRecord.id);

        return { message: 'OTP verified successfully' };
    } catch (err) {
        throw new ApplicationError(err.message, err.statusCode || 500);
    }
};

module.exports = {
    encryptedPassword,
    checkPassword,
    authorize,
    generateOtp,
    verifyOtp,
    login,
    logout
};