var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const cors = require("cors");
const authRouter = require("./app/api/auth/router");

const companyIndustryRouter = require("./app/api/company-industry/router");
const companyRouter = require("./app/api/company/router");

const skillRouter = require("./app/api/skill/router");

const jobRouter = require("./app/api/job/router");
const jobCategoryRouter = require("./app/api/job-category/router");

const candidateRouter = require("./app/api/candidate/router");
const candidateWorkExperienceRouter = require("./app/api/candidate-work-experience/router");
const candidateEducation = require("./app/api/candidate-education/router");

const jobApplicationRouter = require("./app/api/job-application/router");

const { decodeToken } = require("./app/api/auth/middleware");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(decodeToken());
app.use("/auth", authRouter);

app.use("/api", companyIndustryRouter);
app.use("/api", companyRouter);

app.use("/api", skillRouter);

app.use("/api", jobRouter);
app.use("/api", jobCategoryRouter);

app.use("/api", candidateRouter);
app.use("/api", candidateWorkExperienceRouter);
app.use("/api", candidateEducation);

app.use("/api", jobApplicationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
