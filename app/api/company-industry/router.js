const router = require("express").Router();
const multer = require('multer')

const companyIndustryController = require("./controller");

router.get("/company_industries", multer().none(), companyIndustryController.index);
router.post("/company_industry", multer().none(), companyIndustryController.store);
router.put("/company_industry/:id", multer().none(), companyIndustryController.update);
router.delete("/company_industry/:id", multer().none(), companyIndustryController.destroy);

module.exports = router;