const CandidateWorkExperience = require("./model");
const Candidate = require("../candidate/model");

async function index(req, res, next) {
  try {
    let { user_candidate_id } = req.params;

    let candidateWorkExperience = await CandidateWorkExperience.find({
      user_candidate: user_candidate_id,
    })
      .select("-__v")
      .populate({
        path: "user_candidate",
        model: "User",
        select: "first_name last_name email",
      });

    if (candidateWorkExperience.length > 0) {
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success get all candidate work experience",
        data: candidateWorkExperience,
      });
    } else {
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "No data available",
        data: candidateWorkExperience,
      });
    }
  } catch (err) {
    next(err);
  }
}

async function store(req, res, next) {
  try {
    let payload = req.body;
    // let user_candidate = req.user;

    // let checkUserCandidate = await Candidate.findOne(
    //     { user_candidate: { $eq: user_candidate._id } }
    // );

    // if(!checkUserCandidate){
    //     return res.status(401).json({
    //         code: 401,
    //         status: "UNAUTHORIZED",
    //     });
    // }

    let candidateWorkExperience = new CandidateWorkExperience(payload);

    await candidateWorkExperience.save();

    return res.status(201).json({
      code: 200,
      status: "OK",
      message: "Success create candidate work experience",
      data: candidateWorkExperience,
    });
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
    let payload = req.body;
    let candidateWorkExperienceId = req.params.id;

    let candidateWorkExperience =
      await CandidateWorkExperience.findOneAndUpdate(
        {
          _id: candidateWorkExperienceId,
        },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

    if (candidateWorkExperience) {
      return res.status(201).json({
        code: 200,
        status: "OK",
        message: "Success update candidate work experience",
        data: candidateWorkExperience,
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "NOT FOUND",
        message: "Id candidate work experience not found",
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

async function destroy(req, res, next) {
  try {
    let candidateWorkExperienceId = req.params.id;

    let candidateWorkExperience =
      await CandidateWorkExperience.findOneAndDelete({
        _id: candidateWorkExperienceId,
      });

    if (candidateWorkExperience) {
      return res.status(201).json({
        code: 200,
        status: "OK",
        message: "Success delete candidate work experience",
        data: candidateWorkExperience,
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "NOT FOUND",
        message: "Id candidate work experience not found",
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
  index,
  store,
  update,
  destroy,
};
