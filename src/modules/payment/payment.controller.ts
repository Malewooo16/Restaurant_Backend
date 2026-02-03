import { Request, Response } from 'express';
import * as paymentService from './payment.service';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderPaymentSummary = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const summary = await paymentService.getOrderPaymentSummary(parseInt(orderId as string));
    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentsByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const payments = await paymentService.getPaymentsByOrderId(parseInt(orderId as string));
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.getPaymentById(parseInt(id as string));
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.refundPayment(parseInt(id as string));
    res.status(200).json(payment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
