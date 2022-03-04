const Job = require("./model");
const Company = require("../company/model");
const JobSkills = require("../skill/model");
const JobCategory = require("../job-category/model");

async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0, query = "", job_category = "" } = req.query;
    let criteria = {};

    if (query.length) {
      criteria = {
        ...criteria,
        job_position: { $regex: `${query}`, $options: "i" },
      };
    }

    if (job_category.length) {
      // mencari job_category tersebut di collection job categories
      job_category = await JobCategory.findOne({
        name: { $regex: `${job_category}`, $options: "i" },
      });
      // jika kategori ditemukan
      if (job_category) {
        criteria = { ...criteria, job_category: job_category._id };
      }
    }

    let count = await Job.find(criteria).countDocuments();

    let jobs = await Job.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      // .populate({
      //     path: 'user_company',
      //     model: 'User',
      //     select: 'first_name last_name'
      // })
      .populate({
        path: "job_category",
        model: "JobCategory",
        select: "name",
      })
      .populate({
        path: "company_name",
        select: "-user_company",

        populate: {
          path: "company_industry",
          model: "CompanyIndustry",
        },
      })
      .populate("job_skills")
      .select("-__v");

    return res.status(200).json({
      code: 200,
      status: "OK",
      message: "Success get all jobs",
      data: jobs,
      count,
    });
  } catch (err) {
    next(err);
  }
}

async function getJobByIdCompany(req, res, next) {
  try {
    let user_company = req.user;
    let jobByIdCompany = await Job.find({
      user_company: user_company._id,
    })
      .select("-__v")
      .populate({
        path: "job_category",
        model: "JobCategory",
        select: "name",
      });
    // .populate({
    //     path: 'user_company',
    //     model: 'User',
    //     select: 'first_name last_name email'
    // });

    if (jobByIdCompany.length > 0) {
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success get all job by company",
        data: jobByIdCompany,
      });
    } else {
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "No data available",
        data: jobByIdCompany,
      });
    }
  } catch (err) {
    next(err);
  }
}

async function show(req, res, next) {
  try {
    let { job_id } = req.params;

    let job = await Job.findOne({ _id: job_id })
      // .populate({
      //     path: 'user_company',
      //     model: 'User',
      //     select: 'first_name last_name'
      // })
      .populate({
        path: "job_category",
        model: "JobCategory",
        select: "name",
      })
      .populate({
        path: "company_name",
        populate: {
          path: "company_industry",
          model: "CompanyIndustry",
        },
      })
      .populate("job_skills")
      .select("-__v");

    if (job) {
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success get detail job",
        data: job,
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "NOT FOUND",
        message: "Id job not found",
      });
    }
  } catch (err) {
    next(err);
  }
}

async function store(req, res, next) {
  try {
    let payload = req.body;
    let user_company = req.user;

    if (payload.company_name) {
      let company_name = await Company.findOne({
        company_name: { $regex: payload.company_name, $options: "i" },
      });

      if (company_name) {
        payload = { ...payload, company_name: company_name._id };
      } else {
        delete payload.company_name;
      }
    }

    if (payload.job_category) {
      let job_category = await JobCategory.findOne({
        name: { $regex: payload.job_category, $options: "i" },
      });

      if (job_category) {
        payload = { ...payload, job_category: job_category._id };
      } else {
        delete payload.job_category;
      }
    }

    if (payload.job_skills && payload.job_skills.length) {
      let job_skills = await JobSkills.find({
        name: { $in: payload.job_skills },
      });

      if (job_skills.length) {
        payload = {
          ...payload,
          job_skills: job_skills.map((job_skill) => job_skill._id),
        };
      }
    }

    let job = new Job({
      ...payload,
      user_company: user_company._id,
    });

    await job.save();

    return res.status(201).json({
      code: 200,
      status: "OK",
      message: "Success create job",
      data: job,
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

    if (payload.company_name) {
      let company_name = await Company.findOne({
        company_name: { $regex: payload.company_name, $options: "i" },
      });

      if (company_name) {
        payload = { ...payload, company_name: company_name._id };
      } else {
        delete payload.company_name;
      }
    }

    if (payload.job_category) {
      let job_category = await JobCategory.findOne({
        name: { $regex: payload.job_category, $options: "i" },
      });

      if (job_category) {
        payload = { ...payload, job_category: job_category._id };
      } else {
        delete payload.job_category;
      }
    }

    if (payload.job_skills && payload.job_skills.length) {
      let job_skills = await JobSkills.find({
        name: { $in: payload.job_skills },
      });

      if (job_skills.length) {
        payload = {
          ...payload,
          job_skills: job_skills.map((job_skill) => job_skill._id),
        };
      }
    }

    let job = await Job.findOneAndUpdate({ _id: req.params.id }, payload, {
      new: true,
      runValidators: true,
    });

    return res.status(201).json({
      code: 200,
      status: "OK",
      message: "Success update job",
      data: job,
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

async function destroy(req, res, next) {
  try {
    let jobId = req.params.id;

    let job = await Job.findOneAndDelete({
      _id: jobId,
    });

    if (job) {
      return res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success delete job",
        data: job,
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: "NOT FOUND",
        message: "Id job not found",
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  getJobByIdCompany,
};
