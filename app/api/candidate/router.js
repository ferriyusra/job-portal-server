const router = require("express").Router();
const multer = require("multer");
const os = require("os");

const candidateController = require("./controller");

router.get("/candidate/:user_candidate_id", candidateController.index);
router.post(
  "/candidate",
  multer({ dest: os.tmpdir() }).single("resume"),
  candidateController.store
);
router.put(
  "/candidate/:id",
  multer({ dest: os.tmpdir() }).single("resume"),
  candidateController.update
);

module.exports = router;
