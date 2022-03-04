const Candidate = require("./model");
const Skill = require("../skill/model");

const fs = require("fs");
const path = require("path");
const config = require("../../config");

async function index(req, res, next) {
  try {
    let { user_candidate_id } = req.params;

    let candidate = await Candidate.findOne({
      user_candidate: user_candidate_id,
    })
      .select("-__v")
      .populate({
        path: "user_candidate",
        model: "User",
        select: "first_name last_name email",
      });
    // .populate({
    //   path: "skills",
    //   model: "Skill",
    //   select: "name",
    // });

    return res.status(200).json({
      code: 200,
      status: "OK",
      message: "Success get data profile candidate",
      data: candidate,
    });
  } catch (err) {
    next(err);
  }
}

async function store(req, res, next) {
  try {
    let user_candidate = req.user;
    let payload = req.body;

    // if (payload.skills && payload.skills.length) {
    //   let skills = await Skill.find({ name: { $in: payload.skills } });

    //   if (skills.length) {
    //     payload = { ...payload, skills: skills.map((skill) => skill._id) };
    //   }
    // }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/upload/candidate_resume/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let candidate = new Candidate({
            ...payload,
            user_candidate: user_candidate._id,
            resume_url: filename,
          });

          await candidate.save();

          return res.status(201).json({
            code: 200,
            status: "OK",
            message: "Success create profile",
            data: candidate,
          });
        } catch (err) {
          fs.unlinkSync(target_path);

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
      });

      src.on("error", async () => {
        next(err);
      });
    } else {
      let candidate = await Candidate({
        ...payload,
        user_candidate: user_candidate._id,
      });

      await candidate.save();

      return res.status(201).json({
        code: 200,
        status: "OK",
        message: "Success create profile",
        data: candidate,
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

async function update(req, res, next) {
  try {
    let user_candidate = req.user;
    let payload = req.body;

    if (payload.skills && payload.skills.length) {
      let skills = await Skill.find({ name: { $in: payload.skills } });

      if (skills.length) {
        payload = { ...payload, skills: skills.map((skill) => skill._id) };
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/upload/candidate_resume/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let candidate = await Candidate.findOne({ _id: req.params.id });

          let currentImage = `${config.rootPath}/public/upload/candidate_resume/${company.resume}`;

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          candidate = await Candidate.findOneAndUpdate(
            { _id: req.params.id },
            {
              ...payload,
              user_candidate: user_candidate._id,
              resume: filename,
            },
            { new: true, runValidators: true }
          );

          return res.status(201).json({
            code: 200,
            status: "OK",
            message: "Success update profile",
            data: candidate,
          });
        } catch (err) {
          fs.unlinkSync(target_path);

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
      });

      src.on("error", async () => {
        next(err);
      });
    } else {
      let candidate = await Candidate.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true }
      );

      await candidate.save();

      return res.status(201).json({
        code: 200,
        status: "OK",
        message: "Success update profile",
        data: candidate,
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
  store,
  index,
  update,
};
