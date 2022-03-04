const router = require("express").Router();
const multer = require('multer')

const skillController = require("./controller");

router.get("/skills", multer().none(), skillController.index);
router.post("/skill", multer().none(), skillController.store);
router.put("/skill/:id", multer().none(), skillController.update);
router.delete("/skill/:id", multer().none(), skillController.destroy);

module.exports = router;