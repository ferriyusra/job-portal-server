const router = require("express").Router();
const multer = require("multer");

const candidateWorkExperienceController = require("./controller");

router.get(
  "/candidate-work-experiences/:user_candidate_id",
  multer().none(),
  candidateWorkExperienceController.index
);
router.post(
  "/candidate-work-experience",
  multer().none(),
  candidateWorkExperienceController.store
);
router.put(
  "/candidate-work-experience/:id",
  multer().none(),
  candidateWorkExperienceController.update
);
router.delete(
  "/candidate-work-experience/:id",
  multer().none(),
  candidateWorkExperienceController.destroy
);

module.exports = router;
