import { Request, Response } from 'express';
import * as orderService from './order.service';
import { validateOrderItems } from './order.validation.util';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { orderItems, ...orderData } = req.body;
    await validateOrderItems(orderItems);
    const order = await orderService.createOrder(orderData, orderItems);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(parseInt(id as string));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderData = req.body;
    //await validateOrderItems(orderItems);
    const order = await orderService.updateOrder(
      parseInt(id as string),
      orderData,
    );
    res.status(200).json(order);
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(parseInt(id as string));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllKitchenOrders = async (req: Request, res: Response) => {
  try {
    const kitchenOrders = await orderService.getAllKitchenOrders();
    res.status(200).json(kitchenOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllKitchenOrdersWithDetails = async (req: Request, res: Response) => {
  try {
    const kitchenOrders = await orderService.getAllKitchenOrdersWithDetails();
    res.status(200).json(kitchenOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBarOrders = async (req: Request, res: Response) => {
  try {
    const barOrders = await orderService.getAllBarOrders();
    res.status(200).json(barOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getKitchenOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const kitchenOrder = await orderService.getKitchenOrderById(
      parseInt(id as string)
    );
    if (!kitchenOrder) {
      return res.status(404).json({ message: 'Kitchen order not found' });
    }
    res.status(200).json(kitchenOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBarOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const barOrder = await orderService.getBarOrderById(parseInt(id as string));
    if (!barOrder) {
      return res.status(404).json({ message: 'Bar order not found' });
    }
    res.status(200).json(barOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateKitchenOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const kitchenOrder = await orderService.updateKitchenOrderStatus(
      parseInt(id as string),
      req.body
    );
    res.status(200).json(kitchenOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBarOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const barOrder = await orderService.updateBarOrderStatus(
      parseInt(id as string),
      req.body
    );
    res.status(200).json(barOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderItemStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderItem = await orderService.updateOrderItemStatus(
      parseInt(id as string),
      req.body
    );
    res.status(200).json(orderItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const recentOrders = await orderService.getRecentOrders();
    res.status(200).json(recentOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
