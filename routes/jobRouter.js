import { Router } from 'express';
const router = Router();

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { validateJobInput, validateIdParam } from '../middleware/validationMiddleware.js';

// one method
// ------------------------------------
// router.get('/', getAllJobs);
// router.post('/', createJob);
// ------------------------------------
// Another Method
// -----------------------------------

router.route('/').get(getAllJobs).post(validateJobInput, createJob); 
router.route('/:id')
.get(validateIdParam, getJob)
.patch(validateIdParam, updateJob) 
.delete(validateIdParam,deleteJob);

export default router;
