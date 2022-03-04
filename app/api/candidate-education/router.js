const router = require("express").Router();
const multer = require("multer");

const candidateEducationController = require("./controller");

router.get(
  "/candidate-educations/:user_candidate_id",
  multer().none(),
  candidateEducationController.index
);
router.post(
  "/candidate-education",
  multer().none(),
  candidateEducationController.store
);
router.put(
  "/candidate-education/:id",
  multer().none(),
  candidateEducationController.update
);
router.delete(
  "/candidate-education/:id",
  multer().none(),
  candidateEducationController.destroy
);

module.exports = router;
