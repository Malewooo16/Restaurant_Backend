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

const router = Router();

router.get('/', getAllDissatisfactions);
router.get('/status', getDissatisfactionsByStatus);
router.get('/:id', getDissatisfactionById);
router.post('/', createDissatisfaction);
router.put('/:id', updateDissatisfaction);
router.patch('/:id/status', updateDissatisfactionStatus);
router.delete('/:id', deleteDissatisfaction);

export default router;