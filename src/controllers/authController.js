const authService = require("../services/authService");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Attempting login for user:", email);
        console.log("Login attempt details:", { email, password });

        const user = await authService.login(email, password);

        res.status(200).json({
            status: "LOGIN SUCCESS",
            data: user,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            status: "LOGIN FAIL",
            message: err.message,
        });
    }
}

exports.logout = async (req, res) => {
    try {
        authService.logout(req, res);
    } catch (err) {
        res.status(err.statusCode || 500).json({
            status: "LOGOUT FAIL",
            message: err.message,
        });
    }
}

exports.generateOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = await authService.generateOtp(email);
        res.status(201).json({
            status: "OTP GENERATED",
            data: otp,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "OTP GENERATION FAILED",
            message: error.message,
        });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, code } = req.body;
        const result = await authService.verifyOtp(email, code);
        res.status(201).json({
            status: "OTP VERIFICATION SUCCESS",
            data: result,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "OTP VERIFICATION FAILED",
            message: error.message,
        });
    }
}