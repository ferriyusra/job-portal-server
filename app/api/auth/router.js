const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const authController = require("./controller");
passport.use(
  new LocalStrategy({ usernameField: "email" }, authController.localStrategy)
);

router.post("/register", multer().none(), authController.register);

router.post("/login", multer().none(), authController.login);
router.get("/me", multer().none(), authController.me);
router.post("/logout", multer().none(), authController.logout);
router.put(
  "/update-profile/:id",
  multer({ dest: os.tmpdir() }).single("user_image_url"),
  authController.update
);
router.get(
  "/get-user/:user_candidate_id",
  multer({ dest: os.tmpdir() }).single("resume_url"),
  authController.getUserById
);

module.exports = router;
