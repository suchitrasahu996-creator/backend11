import express from 'express';
import {
  getGoals,
  addGoal,
  modifyGoal,
  removeGoal,
  saveToGoal,
} from '../controllers/goal.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getGoals).post(addGoal);

router.route('/:id').put(modifyGoal).delete(removeGoal);

router.patch('/:id/save', saveToGoal);

export default router;
