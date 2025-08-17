const authService = require("../services/authService");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

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
