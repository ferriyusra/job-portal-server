const router = require('express').Router();
const multer = require('multer')
const JobApplication = require('./controller');

router.get('/my-applications', JobApplication.index);
router.get('/candidate-applications', JobApplication.getApplicationForCompany);
router.post('/send-application', multer().none(), JobApplication.store);
router.put('/update-application/:application_id', multer().none(), JobApplication.update);

module.exports = router;