import { Router } from 'express';
import {
  getAllBarReturns,
  getBarReturnById,
  createBarReturn,
  updateBarReturn,
  updateBarReturnStatus,
  deleteBarReturn,
  getBarReturnsByStatus,
} from './bar-return.controller';
import { requirePermission } from '../../middleware/permissions';

const router = Router();

// Permission middleware for bar order issues (returns)
const viewOrderIssues = requirePermission('bar.order_issues');

router.get('/', viewOrderIssues, getAllBarReturns);
router.get('/status', viewOrderIssues, getBarReturnsByStatus);
router.get('/:id', viewOrderIssues, getBarReturnById);
router.post('/', createBarReturn);
router.put('/:id', updateBarReturn);
router.patch('/:id/status', updateBarReturnStatus);
router.delete('/:id', deleteBarReturn);

export default router;