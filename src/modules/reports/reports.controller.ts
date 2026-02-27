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

// Get Goods Received Report
export const getGoodsReceivedReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getGoodsReceivedReport({ startDate, endDate });
    res.json({ goodsReceived: data });
  } catch (error) {
    console.error('Error fetching goods received report:', error);
    res.status(500).json({ error: 'Failed to fetch goods received report' });
  }
};

// Get Purchase Order Detailed Report
export const getPurchaseOrderDetailedReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getPurchaseOrderDetailedReport({ startDate, endDate });
    res.json({ purchaseOrders: data });
  } catch (error) {
    console.error('Error fetching purchase order detailed report:', error);
    res.status(500).json({ error: 'Failed to fetch purchase order detailed report' });
  }
};

// Get Purchase Order Summary Report
export const getPurchaseOrderSummaryReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getPurchaseOrderSummaryReport({ startDate, endDate });
    res.json({ purchaseOrders: data });
  } catch (error) {
    console.error('Error fetching purchase order summary report:', error);
    res.status(500).json({ error: 'Failed to fetch purchase order summary report' });
  }
};

// Get Suppliers List Report
export const getSuppliersListReport = async (req: Request, res: Response) => {
  try {
    const data = await reportsService.getSuppliersListReport();
    res.json({ suppliers: data });
  } catch (error) {
    console.error('Error fetching suppliers list report:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers list report' });
  }
};

// =======================
// INVENTORY REPORTS
// =======================

// Get Inventory Summary Report
export const getInventorySummaryReport = async (req: Request, res: Response) => {
  try {
    const data = await reportsService.getInventorySummaryReport();
    res.json({ inventory: data });
  } catch (error) {
    console.error('Error fetching inventory summary report:', error);
    res.status(500).json({ error: 'Failed to fetch inventory summary report' });
  }
};

// Get Low Stock Report
export const getLowStockReport = async (req: Request, res: Response) => {
  try {
    const data = await reportsService.getLowStockReport();
    res.json({ lowStock: data });
  } catch (error) {
    console.error('Error fetching low stock report:', error);
    res.status(500).json({ error: 'Failed to fetch low stock report' });
  }
};

// Get Inventory Adjustments Report
export const getInventoryAdjustmentsReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getInventoryAdjustmentsReport({ startDate, endDate });
    res.json({ adjustments: data });
  } catch (error) {
    console.error('Error fetching inventory adjustments report:', error);
    res.status(500).json({ error: 'Failed to fetch inventory adjustments report' });
  }
};

// Get Inventory Requests Report
export const getInventoryRequestsReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getInventoryRequestsReport({ startDate, endDate });
    res.json({ requests: data });
  } catch (error) {
    console.error('Error fetching inventory requests report:', error);
    res.status(500).json({ error: 'Failed to fetch inventory requests report' });
  }
};

// Get Expiring Batches Report
export const getExpiringBatchesReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getExpiringBatchesReport({ startDate, endDate });
    res.json({ batches: data });
  } catch (error) {
    console.error('Error fetching expiring batches report:', error);
    res.status(500).json({ error: 'Failed to fetch expiring batches report' });
  }
};

// =======================
// ACCOUNTING REPORTS
// =======================

// Get Expense Summary Report
export const getExpenseSummaryReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getExpenseSummaryReport({ startDate, endDate });
    res.json({ expenses: data });
  } catch (error) {
    console.error('Error fetching expense summary report:', error);
    res.status(500).json({ error: 'Failed to fetch expense summary report' });
  }
};

// Get Expense Detailed Report
export const getExpenseDetailedReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getExpenseDetailedReport({ startDate, endDate });
    res.json({ expenses: data });
  } catch (error) {
    console.error('Error fetching expense detailed report:', error);
    res.status(500).json({ error: 'Failed to fetch expense detailed report' });
  }
};

// Get Revenue Report
export const getRevenueReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getRevenueReport({ startDate, endDate });
    res.json({ revenue: data });
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    res.status(500).json({ error: 'Failed to fetch revenue report' });
  }
};

// Get Gross Profit Report
export const getGrossProfitReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getGrossProfitReport({ startDate, endDate });
    res.json({ grossProfit: data });
  } catch (error) {
    console.error('Error fetching gross profit report:', error);
    res.status(500).json({ error: 'Failed to fetch gross profit report' });
  }
};

// Get Net Profit Report
export const getNetProfitReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query as DateRangeQuery;
    const data = await reportsService.getNetProfitReport({ startDate, endDate });
    res.json({ netProfit: data });
  } catch (error) {
    console.error('Error fetching net profit report:', error);
    res.status(500).json({ error: 'Failed to fetch net profit report' });
  }
};