import { Router } from 'express';
import * as adjustmentReasonController from './adjustment-reason.controller';
import { validate } from '../../middleware/validate';
import * as adjustmentReasonValidation from './adjustment-reason.validation';

const router = Router();

/**
 * @swagger
 * /api/adjustment-reasons:
 *   get:
 *     summary: Get all adjustment reasons
 *     tags: [Adjustment Reason]
 *     responses:
 *       200:
 *         description: A list of adjustment reasons.
 */
router.get('/', adjustmentReasonController.getAllAdjustmentReasons);

/**
 * @swagger
 * /api/adjustment-reasons:
 *   post:
 *     summary: Create a new adjustment reason
 *     tags: [Adjustment Reason]
 */
router.post(
  '/',
  validate(adjustmentReasonValidation.createAdjustmentReasonSchema),
  adjustmentReasonController.createAdjustmentReason
);

/**
 * @swagger
 * /api/adjustment-reasons/{id}:
 *   get:
 *     summary: Get adjustment reason by ID
 *     tags: [Adjustment Reason]
 */
router.get('/:id', adjustmentReasonController.getAdjustmentReasonById);

/**
 * @swagger
 * /api/adjustment-reasons/{id}:
 *   patch:
 *     summary: Update an adjustment reason
 *     tags: [Adjustment Reason]
 */
router.patch(
  '/:id',
  validate(adjustmentReasonValidation.updateAdjustmentReasonSchema),
  adjustmentReasonController.updateAdjustmentReason
);

/**
 * @swagger
 * /api/adjustment-reasons/{id}:
 *   delete:
 *     summary: Delete an adjustment reason
 *     tags: [Adjustment Reason]
 */
router.delete('/:id', adjustmentReasonController.deleteAdjustmentReason);

export default router;