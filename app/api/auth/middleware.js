const { getToken } = require("../utils/get-token");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const User = require("../user/model");

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, config.secretKey);

      let user = await User.findOne({ token: { $in: [token] } });

      //- token expired jika User tidak ditemukan //
      if (!user) {
        return res.status(400).json({
          error: 1,
          code: 400,
          message: `Token expired`,
        });
      }
    } catch (err) {
      // (tangani error yang terkait JsonWebTokenError
      if (err && err.name === "JsonWebTokenError") {
        return res.json({
          error: 1,
          message: err.message,
        });
      }
      //  tangani error lainnya
      next(err);
    }

    return next();
  };
}

module.exports = {
  decodeToken,
};
