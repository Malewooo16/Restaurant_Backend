import { Request, Response } from 'express';
import * as reportsService from './reports.service';

interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

// Get Order Summary Report
export const getOrderSummaryReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getOrderSummaryReport({ startDate, endDate });
    res.json({ orders: data });
  } catch (error) {
    console.error('Error fetching order summary report:', error);
    res.status(500).json({ error: 'Failed to fetch order summary report' });
  }
};

// Get Order Detailed Report
export const getOrderDetailedReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getOrderDetailedReport({ startDate, endDate });
    res.json({ items: data });
  } catch (error) {
    console.error('Error fetching order detailed report:', error);
    res.status(500).json({ error: 'Failed to fetch order detailed report' });
  }
};

// Get Payments Report
export const getPaymentsReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getPaymentsReport({ startDate, endDate });
    res.json({ payments: data });
  } catch (error) {
    console.error('Error fetching payments report:', error);
    res.status(500).json({ error: 'Failed to fetch payments report' });
  }
};

// Get Refunds Report
export const getRefundsReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getRefundsReport({ startDate, endDate });
    res.json({ refunds: data });
  } catch (error) {
    console.error('Error fetching refunds report:', error);
    res.status(500).json({ error: 'Failed to fetch refunds report' });
  }
};