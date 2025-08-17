const authServices = require("../services/authService");


exports.authorize = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const user = await authServices.authorize(bearerToken)
        req.user = user
        next();
    } catch (err) {
        res.status(err.statusCode || 500).json({
            status: "FAIL",
            message: err.message,
        });
    }
}

exports.isSuperAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'SUPERADMIN') {
            throw {
                statusCode: 403,
                message: "You are not authorized to access this resource"
            }
        }
        next();
    } catch (err) {
        res.status(err.statusCode || 500).json({
            status: "FAIL",
            message: err.message,
        });
    }
}