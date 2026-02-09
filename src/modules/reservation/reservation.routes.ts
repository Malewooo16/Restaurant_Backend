import { Router } from 'express';
import * as reservationController from './reservation.controller';
import { validate } from '../../middleware/validate';
import * as reservationValidation from './reservation.validation';

const router = Router();

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservation'
 *     responses:
 *       201:
 *         description: The created reservation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
router.post(
  '/',
  validate(reservationValidation.createReservationSchema),
  reservationController.createReservation
);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Retrieve reservations with optional filtering
 *     tags: [Reservation]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reservations matching the filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/', reservationController.getReservations);

/**
 * @swagger
 * /api/reservations/tables:
 *   get:
 *     summary: Retrieve tables that are booked/reserved for today
 *     tags: [Reservation]
 *     responses:
 *       200:
 *         description: A list of tables with reservations for today.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   number:
 *                     type: integer
 *                   capacity:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   reservationTime:
 *                     type: string
 *                     format: date-time
 */
router.get('/tables', reservationController.getBookedTables);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Retrieve a single reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single reservation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
router.get('/:id', reservationController.getReservationById);

/**
 * @swagger
 * /api/reservations/{id}:
 *   patch:
 *     summary: Update a reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReservation'
 *     responses:
 *       200:
 *         description: The updated reservation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 */
router.patch(
  '/:id',
  validate(reservationValidation.updateReservationSchema),
  reservationController.updateReservation
);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No content
 */
router.delete('/:id', reservationController.deleteReservation);

export default router;
