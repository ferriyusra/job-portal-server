const User = require("../user/model");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../config");
const { getToken } = require("../utils/get-token");
const fs = require("fs");
const path = require("path");

async function register(req, res, next) {
  try {
    const payload = req.body;

    let user = new User(payload);

    await user.save();

    return res.status(201).json({
      code: 200,
      status: "OK",
      message: "Success register user",
      data: user,
    });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

async function localStrategy(email, password, done) {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -token"
    );

    if (!user) {
      return done();
    }

    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());

      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }

  done();
}

async function login(req, res, next) {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);

    if (!user)
      return res.json({ error: 1, message: "email or password incorrect" });

    let signed = jwt.sign(user, config.secretKey);

    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );

    return res.status(201).json({
      code: 200,
      status: "OK",
      user: user,
      message: "Login successfully",
      token: signed,
    });
  })(req, res, next);
}

async function me(req, res, next) {
  if (!req.user) {
    return res.status(400).json({
      code: 403,
      status: "UNAUTHORIZED",
    });
  }
  return res.status(200).json({
    code: 200,
    status: "OK",
    message: req.user,
  });
}

async function logout(req, res, next) {
  let token = getToken(req);

  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false }
  );

  if (!user || !token) {
    return res.status(400).json({
      code: 404,
      status: "NOT FOUND",
      message: "User not found",
    });
  }

  return res.status(200).json({
    code: 200,
    status: "OK",
    message: "Logout successfully",
  });
}

async function update(req, res, next) {
  try {
    let payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/upload/user_image/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let user_candidate_data = await User.findOne({
            _id: req.params.id,
          });

          let currentImage = `${config.rootPath}/public/upload/user_image/${user_candidate_data.user_image_url}`;

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          user_candidate_data = await User.findOneAndUpdate(
            { _id: req.params.id },
            {
              ...payload,
              user_image_url: filename,
            },
            { new: true, runValidators: true }
          );

          return res.status(201).json({
            code: 200,
            status: "OK",
            message: "Success update user",
            data: user_candidate_data,
          });
        } catch (err) {
          fs.unlinkSync(target_path);

          if (err && err.name === "ValidationError") {
            return res.status(400).json({
              error: 1,
              code: 400,
              status: "BAD REQUEST",
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });

      src.on("error", async () => {
        next(err);
      });
    } else {
      let user_candidate_data = await User.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true }
      );

      return res.status(201).json({
        code: 200,
        status: "OK",
        message: "Success update user",
        data: user_candidate_data,
      });
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(400).json({
        error: 1,
        code: 400,
        status: "BAD REQUEST",
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    let { user_candidate_id } = req.params;
    let user = await User.findOne({
      _id: user_candidate_id,
    }).select("-__v");

    if (user) {
      // return res.json(user);
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success get detail user",
        data: user,
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "NOT FOUND",
        message: "Id user not found",
      });
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(400).json({
        code: 400,
        status: "BAD REQUEST",
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

module.exports = {
  register,
  localStrategy,
  login,
  me,
  logout,
  update,
  getUserById,
};
