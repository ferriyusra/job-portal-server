const router = require('express').Router();
const multer = require('multer')
const os = require('os');
const companyController = require('./controller');

router.get('/companies', companyController.index);
router.get('/company/:company_id', companyController.show);
router.post('/company', multer({ dest: os.tmpdir() }).single('image'), companyController.store);
router.put('/company/:id', multer({ dest: os.tmpdir() }).single('image'), companyController.update);
router.delete('/company/:id', companyController.destroy);

module.exports = router;