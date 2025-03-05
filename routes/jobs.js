import express from 'express'
const router = express.Router()
import { getAllJobs, getJob, createJob, updateJob, deleteJob } from '../controllers/jobs.js'

router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

export default router