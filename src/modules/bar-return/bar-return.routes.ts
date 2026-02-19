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

const router = Router();

router.get('/', getAllBarReturns);
router.get('/status', getBarReturnsByStatus);
router.get('/:id', getBarReturnById);
router.post('/', createBarReturn);
router.put('/:id', updateBarReturn);
router.patch('/:id/status', updateBarReturnStatus);
router.delete('/:id', deleteBarReturn);

export default router;