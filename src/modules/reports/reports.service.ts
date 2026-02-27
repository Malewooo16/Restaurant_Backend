import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// Order Summary Report - Paid orders with order #, date, item count, total, waiter
export const getOrderSummaryReport = async (params: DateRangeParams) => {
  const where: any = {
    status: 'PAID',
  };

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform data to match expected format
  return orders.map(order => ({
    orderNumber: order.orderNumber,
    date: order.createdAt,
    itemCount: order.orderItems.length,
    total: order.total,
    waiter: order.waiter || 'N/A',
  }));
};

// Order Detailed Report - Paid order items with date, item, quantity, price
export const getOrderDetailedReport = async (params: DateRangeParams) => {
  const whereClause: any = {
    order: {
      status: 'PAID',
    },
  };

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    whereClause.order.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const orderItems = await prisma.orderItem.findMany({
    where: whereClause,
    include: {
      menuItem: {
        select: {
          name: true,
        },
      },
      order: {
        select: {
          orderNumber: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      order: {
        createdAt: 'desc',
      },
    },
  });

  // Transform data to match expected format
  return orderItems.map(item => ({
    date: item.order.createdAt,
    orderNumber: item.order.orderNumber,
    item: item.menuItem.name,
    quantity: item.quantity,
    price: item.price,
  }));
};

// Payments Report - Paid orders with payment details
export const getPaymentsReport = async (params: DateRangeParams) => {
  const whereClause: any = {
    status: 'COMPLETED',
    order: {
      status: 'PAID',
    },
  };

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    whereClause.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const payments = await prisma.payment.findMany({
    where: whereClause,
    include: {
      order: {
        select: {
          orderNumber: true,
          waiter: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform data to match expected format
  return payments.map(payment => ({
    orderNumber: payment.order.orderNumber,
    date: payment.createdAt,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    waiter: payment.order.waiter || 'N/A',
  }));
};

// Refund Report - Dissatisfactions with REFUNDED status
export const getRefundsReport = async (params: DateRangeParams) => {
  const where: any = {
    status: 'REFUNDED',
  };

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const refunds = await prisma.dissatisfaction.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform data to match expected format
  return refunds.map(refund => ({
    orderNumber: refund.orderId,
    date: refund.createdAt,
    item: refund.itemName,
    price: 0, // Dissatisfaction doesn't track price, set to 0
    reason: refund.reason,
    waiter: 'N/A', // Dissatisfaction doesn't track waiter
  }));
};

// Goods Received Report - Supplier, Item Name, Qty, Price, Total, Received Date, Received By
export const getGoodsReceivedReport = async (params: DateRangeParams) => {
  const where: any = {};

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.receivedAt = {
      gte: start,
      lte: end,
    };
  }

  const goodsReceived = await prisma.goodsReceiving.findMany({
    where,
    include: {
      supplier: true,
      createdBy: {
        select: {
          username: true,
        },
      },
      receivedItems: {
        include: {
          inventoryItem: true,
        },
      },
    },
    orderBy: {
      receivedAt: 'desc',
    },
  });

  // Transform data to flat format (one row per item)
  const result: any[] = [];
  goodsReceived.forEach(gr => {
    gr.receivedItems.forEach(item => {
      result.push({
        supplier: gr.supplier.name,
        itemName: item.inventoryItem.name,
        quantity: item.quantityReceived,
        unitPrice: item.inventoryItem.price || 0,
        total: item.quantityReceived * (item.inventoryItem.price || 0),
        receivedDate: gr.receivedAt,
        receivedBy: gr.createdBy?.username || 'N/A',
      });
    });
  });

  return result;
};

// Purchase Order Detailed Report - Order #, Date, Status, Supplier, Item, Qty, Price, Total
export const getPurchaseOrderDetailedReport = async (params: DateRangeParams) => {
  const where: any = {};

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.orderedAt = {
      gte: start,
      lte: end,
    };
  }

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where,
    include: {
      supplier: true,
      createdBy: {
        select: {
          username: true,
        },
      },
      items: {
        include: {
          inventoryItem: true,
        },
      },
    },
    orderBy: {
      orderedAt: 'desc',
    },
  });

  // Transform data to flat format (one row per item)
  const result: any[] = [];
  purchaseOrders.forEach(po => {
    po.items.forEach(item => {
      result.push({
        orderNumber: po.poNumber,
        date: po.orderedAt,
        status: po.status,
        supplier: po.supplier.name,
        item: item.inventoryItem.name,
        quantity: item.quantityOrdered,
        unitPrice: item.unitPrice,
        total: item.quantityOrdered * item.unitPrice,
        createdBy: po.createdBy?.username || 'N/A',
      });
    });
  });

  return result;
};

// Purchase Order Summary Report - Order #, Date, Supplier, Status, Total, Created By
export const getPurchaseOrderSummaryReport = async (params: DateRangeParams) => {
  const where: any = {};

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.orderedAt = {
      gte: start,
      lte: end,
    };
  }

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where,
    include: {
      supplier: true,
      createdBy: {
        select: {
          username: true,
        },
      },
      items: true,
    },
    orderBy: {
      orderedAt: 'desc',
    },
  });

  // Transform data - calculate total for each order
  return purchaseOrders.map(po => {
    const total = po.items.reduce((sum, item) => sum + (item.quantityOrdered * item.unitPrice), 0);
    return {
      orderNumber: po.poNumber,
      date: po.orderedAt,
      supplier: po.supplier.name,
      status: po.status,
      total,
      createdBy: po.createdBy?.username || 'N/A',
    };
  });
};

// Suppliers List Report - Name, Contact Person, Email, Phone, Address
export const getSuppliersListReport = async () => {
  const suppliers = await prisma.supplier.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return suppliers.map(supplier => ({
    name: supplier.name,
    contactPerson: supplier.contactPerson || 'N/A',
    email: supplier.email || 'N/A',
    phone: supplier.phone || 'N/A',
    address: supplier.address || 'N/A',
  }));
};

// =======================
// INVENTORY REPORTS
// =======================

// Inventory Summary Report - Item Name, Category, Qty, Unit Price, Total Value
export const getInventorySummaryReport = async () => {
  const inventoryItems = await prisma.inventoryItem.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return inventoryItems.map(item => ({
    itemName: item.name,
    category: item.category.name,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: item.price,
    totalValue: item.quantity * item.price,
    location: item.location || 'N/A',
  }));
};

// Low Stock Items Report - Item, Current Qty, Min Stock, Status
export const getLowStockReport = async () => {
  const inventoryItems = await prisma.inventoryItem.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      quantity: 'asc',
    },
  });

  // Filter to only low stock items in JavaScript
  const lowStockItems = inventoryItems.filter(item => {
    const minStock = item.minStock || 0;
    return item.quantity <= minStock || item.quantity <= 0;
  });

  return lowStockItems.map(item => {
    // Determine status
    let status: string;
    if (item.quantity <= 0) {
      status = 'OUT OF STOCK';
    } else if (item.minStock && item.quantity <= (item.minStock * 0.5)) {
      status = 'CRITICAL';
    } else {
      status = 'LOW';
    }

    return {
      itemName: item.name,
      category: item.category.name,
      currentQuantity: item.quantity,
      minStock: item.minStock || 0,
      unit: item.unit,
      status,
    };
  });
};

// Inventory Adjustments Report - Item, Type, Qty, Reason, Date, Adjusted By
export const getInventoryAdjustmentsReport = async (params: DateRangeParams) => {
  const where: any = {};

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const adjustments = await prisma.inventoryAdjustment.findMany({
    where,
    include: {
      inventoryItem: {
        select: {
          name: true,
        },
      },
      adjustmentReason: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return adjustments.map(adj => ({
    date: adj.createdAt,
    itemName: adj.inventoryItem.name,
    adjustmentType: adj.adjustmentType,
    quantity: adj.quantity,
    previousQuantity: adj.previousQuantity,
    newQuantity: adj.newQuantity,
    reason: adj.adjustmentReason.name,
    adjustedBy: adj.createdBy?.username || 'N/A',
    notes: adj.notes || '',
  }));
};

// Inventory Requests Report - Request ID, Date, Requested From, Item, Qty, Status
export const getInventoryRequestsReport = async (params: DateRangeParams) => {
  const where: any = {};

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.requestedAt = {
      gte: start,
      lte: end,
    };
  }

  const stockRequests = await prisma.stockRequest.findMany({
    where,
    include: {
      requestItems: {
        include: {
          item: {
            select: {
              name: true,
              unit: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      requestedAt: 'desc',
    },
  });

  // Transform to flat format (one row per item)
  const result: any[] = [];
  stockRequests.forEach(request => {
    request.requestItems.forEach(item => {
      result.push({
        requestId: request.requestId,
        date: request.requestedAt,
        requestedFrom: request.requestedFrom || 'N/A',
        requestedBy: request.requestedBy || request.createdBy?.username || 'N/A',
        itemName: item.item.name,
        quantity: item.quantity,
        unit: item.item.unit,
        status: request.status,
      });
    });
  });

  return result;
};

// Expiring Batches Report - Batch #, Item, Qty, Expiry Date, Days Left
export const getExpiringBatchesReport = async (params: DateRangeParams) => {
  const daysAhead = 10; // Default to 10 days
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);

  const where: any = {
    expiryDate: {
      gte: today,
      lte: futureDate,
    },
  };

  // Allow custom date range if provided
  if (params.startDate && params.endDate) {
    where.expiryDate = {
      gte: new Date(params.startDate),
      lte: new Date(params.endDate),
    };
  }

  const batches = await prisma.batch.findMany({
    where,
    include: {
      inventoryItem: {
        select: {
          name: true,
          unit: true,
        },
      },
    },
    orderBy: {
      expiryDate: 'asc',
    },
  });

  return batches.map(batch => {
    const expiryDate = new Date(batch.expiryDate!);
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      batchNumber: batch.batchNumber,
      itemName: batch.inventoryItem.name,
      quantity: batch.quantity,
      unit: batch.inventoryItem.unit,
      expiryDate: batch.expiryDate,
      daysLeft,
    };
  });
};

// =======================
// ACCOUNTING REPORTS
// =======================

// Expense Summary Report - Category, Total Amount, Count
export const getExpenseSummaryReport = async (params: DateRangeParams) => {
  const where: any = {};

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.date = {
      gte: start,
      lte: end,
    };
  }

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  // Group by category
  const categoryMap = new Map();
  expenses.forEach(expense => {
    const categoryName = expense.category.name;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, { category: categoryName, totalAmount: 0, count: 0 });
    }
    const existing = categoryMap.get(categoryName);
    existing.totalAmount += expense.amount;
    existing.count += 1;
  });

  return Array.from(categoryMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
};

// Expense Detailed Report - Date, Description, Category, Amount, Payment Method
export const getExpenseDetailedReport = async (params: DateRangeParams) => {
  const where: any = {};

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.date = {
      gte: start,
      lte: end,
    };
  }

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      category: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return expenses.map(expense => ({
    date: expense.date,
    description: expense.description || 'N/A',
    category: expense.category.name,
    amount: expense.amount,
    paymentMethod: expense.paymentMethod,
    createdBy: expense.createdBy?.username || 'N/A',
  }));
};

// Revenue Report - Daily revenue from paid orders
export const getRevenueReport = async (params: DateRangeParams) => {
  const where: any = {
    status: 'PAID',
  };

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const orders = await prisma.order.findMany({
    where,
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Group by date (day)
  const dailyRevenue = new Map();
  
  orders.forEach(order => {
    const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
    const existing = dailyRevenue.get(dateKey) || { date: dateKey, revenue: 0, orderCount: 0 };
    existing.revenue += order.total || 0;
    existing.orderCount += 1;
    dailyRevenue.set(dateKey, existing);
  });

  return Array.from(dailyRevenue.values()).sort((a, b) => b.date.localeCompare(a.date));
};

// Gross Profit Report - Revenue - Purchases (COGS) for each day
export const getGrossProfitReport = async (params: DateRangeParams) => {
  const startDate = params.startDate ? new Date(params.startDate) : new Date('1970-01-01');
  const endDate = params.endDate ? new Date(params.endDate) : new Date();

  // Get paid orders revenue by date
  const orders = await prisma.order.findMany({
    where: {
      status: 'PAID',
      createdAt: { gte: startDate, lte: endDate },
    },
    select: {
      createdAt: true,
      total: true,
    },
  });

  // Get goods received (purchases/cost of goods) by date
  const goodsReceived = await prisma.goodsReceiving.findMany({
    where: {
      receivedAt: { gte: startDate, lte: endDate },
    },
    include: {
      receivedItems: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  // Calculate daily revenue
  const dailyData = new Map();
  
  orders.forEach(order => {
    const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
    const existing = dailyData.get(dateKey) || { date: dateKey, revenue: 0, purchases: 0 };
    existing.revenue += order.total || 0;
    dailyData.set(dateKey, existing);
  });

  // Calculate daily purchases (COGS)
  goodsReceived.forEach(gr => {
    const dateKey = new Date(gr.receivedAt).toISOString().split('T')[0];
    const purchaseTotal = gr.receivedItems.reduce((sum, item) => {
      return sum + (item.quantityReceived * (item.inventoryItem.price || 0));
    }, 0);
    
    const existing = dailyData.get(dateKey) || { date: dateKey, revenue: 0, purchases: 0 };
    existing.purchases += purchaseTotal;
    dailyData.set(dateKey, existing);
  });

  // Calculate gross profit for each day
  const result = Array.from(dailyData.values()).map(day => ({
    date: day.date,
    revenue: day.revenue,
    purchases: day.purchases,
    grossProfit: day.revenue - day.purchases,
  }));

  return result.sort((a, b) => b.date.localeCompare(a.date));
};

// Net Profit Report - Revenue - (Purchases + Expenses) for each day
export const getNetProfitReport = async (params: DateRangeParams) => {
  const startDate = params.startDate ? new Date(params.startDate) : new Date('1970-01-01');
  const endDate = params.endDate ? new Date(params.endDate) : new Date();

  // Get paid orders revenue by date
  const orders = await prisma.order.findMany({
    where: {
      status: 'PAID',
      createdAt: { gte: startDate, lte: endDate },
    },
    select: {
      createdAt: true,
      total: true,
    },
  });

  // Get goods received (purchases/cost of goods) by date
  const goodsReceived = await prisma.goodsReceiving.findMany({
    where: {
      receivedAt: { gte: startDate, lte: endDate },
    },
    include: {
      receivedItems: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  // Get expenses by date
  const expenses = await prisma.expense.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    select: {
      date: true,
      amount: true,
    },
  });

  // Calculate daily revenue
  const dailyData = new Map();
  
  orders.forEach(order => {
    const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
    const existing = dailyData.get(dateKey) || { date: dateKey, revenue: 0, purchases: 0, expenses: 0 };
    existing.revenue += order.total || 0;
    dailyData.set(dateKey, existing);
  });

  // Calculate daily purchases (COGS)
  goodsReceived.forEach(gr => {
    const dateKey = new Date(gr.receivedAt).toISOString().split('T')[0];
    const purchaseTotal = gr.receivedItems.reduce((sum, item) => {
      return sum + (item.quantityReceived * (item.inventoryItem.price || 0));
    }, 0);
    
    const existing = dailyData.get(dateKey) || { date: dateKey, revenue: 0, purchases: 0, expenses: 0 };
    existing.purchases += purchaseTotal;
    dailyData.set(dateKey, existing);
  });

  // Calculate daily expenses
  expenses.forEach(expense => {
    const dateKey = new Date(expense.date).toISOString().split('T')[0];
    const existing = dailyData.get(dateKey) || { date: dateKey, revenue: 0, purchases: 0, expenses: 0 };
    existing.expenses += expense.amount;
    dailyData.set(dateKey, existing);
  });

  // Calculate net profit for each day
  const result = Array.from(dailyData.values()).map(day => ({
    date: day.date,
    revenue: day.revenue,
    purchases: day.purchases,
    expenses: day.expenses,
    grossProfit: day.revenue - day.purchases,
    netProfit: day.revenue - (day.purchases + day.expenses),
  }));

  return result.sort((a, b) => b.date.localeCompare(a.date));
};