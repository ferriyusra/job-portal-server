const CandidateEducation = require("./model");
const Candidate = require("../candidate/model");

async function index(req, res, next) {
  try {
    let { user_candidate_id } = req.params;

    let candidateEducation = await CandidateEducation.find({
      user_candidate: user_candidate_id,
    })
      .select("-__v")
      .populate({
        path: "user_candidate",
        model: "User",
        select: "first_name last_name email",
      });

    if (candidateEducation.length > 0) {
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success get all candidate background educations",
        data: candidateEducation,
      });
    } else {
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "No data available",
        data: candidateEducation,
      });
    }
  } catch (err) {
    next(err);
  }
}

async function store(req, res, next) {
  try {
    let payload = req.body;

    let candidateEducation = new CandidateEducation(payload);

    await candidateEducation.save();

    return res.status(201).json({
      code: 200,
      status: "OK",
      message: "Success create candidate background education",
      data: candidateEducation,
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
    let candidateEducationId = req.params.id;

    let candidateEducation = await CandidateEducation.findOneAndUpdate(
      {
        _id: candidateEducationId,
      },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (candidateEducation) {
      return res.status(201).json({
        code: 200,
        status: "OK",
        message: "Success update candidate background education",
        data: candidateEducation,
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
    let candidateEducationId = req.params.id;

    let candidateEducation = await CandidateEducation.findOneAndDelete({
      _id: candidateEducationId,
    });

    if (candidateEducation) {
      return res.status(201).json({
        code: 200,
        status: "OK",
        message: "Success delete candidate background education",
        data: candidateEducation,
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "NOT FOUND",
        message: "Id candidate background education not found",
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
