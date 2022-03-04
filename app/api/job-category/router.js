const router = require("express").Router();
const multer = require('multer')

const jobSkillController = require("./controller");

router.get("/job_categories", multer().none(), jobSkillController.index);
router.post("/job_category", multer().none(), jobSkillController.store);
router.put("/job_category/:id", multer().none(), jobSkillController.update);
router.delete("/job_category/:id", multer().none(), jobSkillController.destroy);

module.exports = router;