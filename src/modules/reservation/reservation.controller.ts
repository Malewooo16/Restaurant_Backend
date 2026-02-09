import { Request, Response } from 'express';
import * as reservationService from './reservation.service';

export const createReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.createReservation(
      req.body
    );
    res.status(201).json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservations = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate, status, search } = req.query;
    const reservations = await reservationService.getReservations({
      startDate: startDate as string,
      endDate: endDate as string,
      status: status as string,
      search: search as string,
    });
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookedTables = async (
  req: Request,
  res: Response
) => {
  try {
    const tables =
      await reservationService.getBookedTables();
    res.status(200).json(tables);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservationById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const reservation =
      await reservationService.getReservationById(
        parseInt(id as string)
      );
    if (!reservation) {
      return res
        .status(404)
        .json({ message: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReservation = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const reservation =
      await reservationService.updateReservation(
        parseInt(id as string),
        req.body
      );
    res.status(200).json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReservation = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await reservationService.deleteReservation(
      parseInt(id as string)
    );
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
