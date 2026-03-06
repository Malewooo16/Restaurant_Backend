import { Router } from 'express';
import {
  getAllDissatisfactions,
  getDissatisfactionById,
  createDissatisfaction,
  updateDissatisfaction,
  updateDissatisfactionStatus,
  deleteDissatisfaction,
  getDissatisfactionsByStatus,
} from './dissatisfaction.controller';
import { requirePermission } from '../../middleware/permissions';

const router = Router();

// Permission middleware for kitchen order issues (dissatisfactions)
const viewOrderIssues = requirePermission('kitchen.order_issues');

router.get('/', viewOrderIssues, getAllDissatisfactions);
router.get('/status', viewOrderIssues, getDissatisfactionsByStatus);
router.get('/:id', viewOrderIssues, getDissatisfactionById);
router.post('/', createDissatisfaction);
router.put('/:id', updateDissatisfaction);
router.patch('/:id/status', updateDissatisfactionStatus);
router.delete('/:id', deleteDissatisfaction);

export default router;