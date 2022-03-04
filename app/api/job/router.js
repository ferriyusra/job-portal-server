const router = require('express').Router();
const multer = require('multer')
const jobController = require('./controller');

router.get('/jobs', jobController.index);
router.get('/job-by-company', jobController.getJobByIdCompany);
router.get('/job/:job_id', jobController.show);
router.post('/job', multer().none(), jobController.store);
router.put('/job/:id', multer().none(), jobController.update);
router.delete('/job/:id', jobController.destroy);

module.exports = router;