import swaggerJSDoc from 'swagger-jsdoc';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const router = Router();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'APOTEk Restaurant API',
    version: '1.0.0',
    description: 'API documentation for the APOTEk Restaurant backend.',
  },
  servers: [
      {
      url: 'http://212.115.110.115:8080',
      description: 'Live server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },

  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // ==== CORE ORDER MODELS ====
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          orderNumber: { type: 'integer' },
          tableNumber: { type: 'integer', nullable: true },
          customerName: { type: 'string', nullable: true },
          waiter: { type: 'string', nullable: true },
          guestCount: { type: 'integer', nullable: true },
          total: { type: 'number', nullable: true },
          status: {
            type: 'string',
            enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SERVED', 'PAID', 'CANCELLED'],
          },
          orderItems: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
          },
          kitchenOrder: { $ref: '#/components/schemas/KitchenOrder', nullable: true },
          barOrder: { $ref: '#/components/schemas/BarOrder', nullable: true },
        },
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          orderId: { type: 'integer' },
          menuItemId: { type: 'integer' },
          quantity: { type: 'integer' },
          price: { type: 'number' },
          notes: { type: 'string', nullable: true },
          selectedSideDishes: { type: 'array', items: { type: 'integer' } },
          selectedAddons: { type: 'array', items: { type: 'integer' } },
          prepArea: { type: 'string', enum: ['KITCHEN', 'BAR'] },
          status: { type: 'string', enum: ['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'] },
          kitchenOrderId: { type: 'integer', nullable: true },
          barOrderId: { type: 'integer', nullable: true },
        },
      },
      CreateOrder: {
        type: 'object',
        required: ['orderItems'],
        properties: {
          tableNumber: { type: 'integer' },
          customerName: { type: 'string' },
          waiter: { type: 'string' },
          guestCount: { type: 'integer' },
          orderItems: { type: 'array', items: { $ref: '#/components/schemas/CreateOrderItem' } },
        },
      },
      CreateOrderItem: {
        type: 'object',
        required: ['menuItemId', 'quantity'],
        properties: {
          menuItemId: { type: 'integer' },
          quantity: { type: 'integer' },
          notes: { type: 'string' },
          selectedSideDishes: { type: 'array', items: { type: 'integer' }, description: 'Array of MenuSideDish IDs' },
          selectedAddons: { type: 'array', items: { type: 'integer' }, description: 'Array of MenuAddon IDs' },
        },
      },
      UpdateOrder: {
        type: 'object',
        properties: {
          tableNumber: { type: 'integer' },
          customerName: { type: 'string' },
          waiter: { type: 'string' },
          guestCount: { type: 'integer' },
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SERVED', 'PAID', 'CANCELLED'] },
          orderItems: {
            type: 'array',
            items: { $ref: '#/components/schemas/CreateOrderItem' },
            description: 'Optional array of order items to update or replace. Existing items will be removed and new ones created.',
          },
        },
      },
      KitchenOrder: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          orderId: { type: 'integer' },
          status: { type: 'string', enum: ['PENDING', 'PREPARING', 'READY', 'CANCELLED'] },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
        },
      },
      BarOrder: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          orderId: { type: 'integer' },
          status: { type: 'string', enum: ['PENDING', 'READY', 'CANCELLED'] },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
        },
      },
      OrderItemWithDetails: {
        allOf: [
          { $ref: '#/components/schemas/OrderItem' },
          { type: 'object', properties: { menuItem: { $ref: '#/components/schemas/MenuItem' } } },
        ],
      },
      KitchenOrderWithDetails: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          orderId: { type: 'integer' },
          status: { type: 'string', enum: ['PENDING', 'PREPARING', 'READY', 'CANCELLED'] },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItemWithDetails' } },
          order: { $ref: '#/components/schemas/Order' },
        },
      },
      UpdateKitchenOrderStatus: {
        type: 'object',
        properties: { status: { type: 'string', enum: ['PENDING', 'PREPARING', 'READY'] } },
      },
      UpdateBarOrderStatus: {
        type: 'object',
        properties: { status: { type: 'string', enum: ['PENDING', 'READY'] } },
      },
      UpdateOrderItemStatus: {
        type: 'object',
        properties: { status: { type: 'string', enum: ['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'] } },
      },

      // ==== MENU MODELS ====
      MenuCategory: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string' },
          isActive: { type: 'boolean' },
          supplierId: { type: 'integer', nullable: true }, // Updated
          supplier: { $ref: '#/components/schemas/Supplier', nullable: true }, // Updated
        },
      },
      CreateMenuCategory: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          isActive: { type: 'boolean' },
        },
      },
      UpdateMenuCategory: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          isActive: { type: 'boolean' },
        },
      },
      MenuAddon: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          isAvailable: { type: 'boolean' },
        },
      },
      CreateMenuAddon: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          isAvailable: { type: 'boolean' },
        },
      },
      UpdateMenuAddon: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          isAvailable: { type: 'boolean' },
        },
      },
      MenuSideDish: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          isAvailable: { type: 'boolean' },
        },
      },
      CreateMenuSideDish: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          isAvailable: { type: 'boolean' },
        },
      },
      UpdateMenuSideDish: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          isAvailable: { type: 'boolean' },
        },
      },
      MenuItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          isAvailable: { type: 'boolean' },
          prepArea: { type: 'string', enum: ['KITCHEN', 'BAR'] },
          categoryId: { type: 'integer' },
          menuCategory: { $ref: '#/components/schemas/MenuCategory' },
          rating: { type: 'number' },
          cost: { type: 'number' },
          prepTime: { type: 'number' },
          calories: { type: 'number' },
          servingSize: { type: 'string' },
          ingredients: { type: 'array', items: { type: 'string' } },
          allergens: { type: 'array', items: { type: 'string' } },
          dietaryOptions: { type: 'array', items: { type: 'string' } },
          featured: { type: 'boolean' },
          seasonal: { type: 'boolean' },
          addons: { type: 'array', items: { $ref: '#/components/schemas/MenuAddon' } },
          sideDishes: { type: 'array', items: { $ref: '#/components/schemas/MenuSideDish' } },
        },
      },
      CreateMenuItem: {
        type: 'object',
        required: ['name', 'price', 'prepArea', 'categoryId'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          isAvailable: { type: 'boolean' },
          prepArea: { type: 'string', enum: ['KITCHEN', 'BAR'] },
          categoryId: { type: 'integer' },
          rating: { type: 'number' },
          cost: { type: 'number' },
          prepTime: { type: 'number' },
          calories: { type: 'number' },
          servingSize: { type: 'string' },
          ingredients: { type: 'array', items: { type: 'string' } },
          allergens: { type: 'array', items: { type: 'string' } },
          dietaryOptions: { type: 'array', items: { type: 'string' } },
          featured: { type: 'boolean' },
          seasonal: { type: 'boolean' },
          addonIds: { type: 'array', items: { type: 'integer' }, description: 'Array of MenuAddon IDs to associate with this menu item.' },
          sideDishIds: { type: 'array', items: { type: 'integer' }, description: 'Array of MenuSideDish IDs to associate with this menu item.' },
        },
      },
      UpdateMenuItem: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          isAvailable: { type: 'boolean' },
          prepArea: { type: 'string', enum: ['KITCHEN', 'BAR'] },
          categoryId: { type: 'integer' },
          rating: { type: 'number' },
          cost: { type: 'number' },
          prepTime: { type: 'number' },
          calories: { type: 'number' },
          servingSize: { type: 'string' },
          ingredients: { type: 'array', items: { type: 'string' } },
          allergens: { type: 'array', items: { type: 'string' } },
          dietaryOptions: { type: 'array', items: { type: 'string' } },
          featured: { type: 'boolean' },
          seasonal: { type: 'boolean' },
          addonIds: { type: 'array', items: { type: 'integer' }, description: 'Array of MenuAddon IDs to associate with this menu item.' },
          sideDishIds: { type: 'array', items: { type: 'integer' }, description: 'Array of MenuSideDish IDs to associate with this menu item.' },
        },
      },

      // ==== INVENTORY MODELS ====
      InventoryCategory: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          isActive: { type: 'boolean' },
          supplierId: { type: 'integer', nullable: true }, // Updated
          supplier: { $ref: '#/components/schemas/Supplier', nullable: true }, // Updated
        },
      },
      CreateInventoryCategory: {
        type: 'object',
        required: ['name'],
        properties: { name: { type: 'string' }, description: { type: 'string' } },
      },
      UpdateInventoryCategory: {
        type: 'object',
        properties: { name: { type: 'string' }, description: { type: 'string' }, isActive: { type: 'boolean' } },
      },
      InventoryUnit: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string' },
          unit: { type: 'string' },
          plural: { type: 'string' },
          symbol: { type: 'string' },
        },
      },
      CreateInventoryUnit: {
        type: 'object',
        required: ['name', 'unit', 'plural', 'symbol'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          unit: { type: 'string' },
          plural: { type: 'string' },
          symbol: { type: 'string' },
        },
      },
      UpdateInventoryUnit: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          unit: { type: 'string' },
          plural: { type: 'string' },
          symbol: { type: 'string' },
        },
      },
      InventoryItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string' },
          sku: { type: 'string' },
          categoryId: { type: 'integer' },
          category: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              description: { type: 'string' },
              isActive: { type: 'boolean' },
            },
          },
          unit: { type: 'string' },
          quantity: { type: 'number' },
          minStock: { type: 'number' },
          maxStock: { type: 'number' },
          price: { type: 'number' },
          supplier: { type: 'string' },
          location: { type: 'string', enum: ['KITCHEN', 'BAR', 'STORAGE', 'WALKIN_COOLER', 'FREEZER', 'DRY_STORAGE'] },
          storageLocation: { type: 'string' },
          status: { type: 'string', enum: ['NORMAL', 'LOW', 'CRITICAL'] },
        },
      },
      CreateInventoryItem: {
        type: 'object',
        required: ['name', 'categoryId', 'unit'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          sku: { type: 'string' },
          categoryId: { type: 'integer' },
          unit: { type: 'string' },
          quantity: { type: 'number' },
          minStock: { type: 'number' },
          maxStock: { type: 'number' },
          price: { type: 'number' },
          supplier: { type: 'string' },
          location: { type: 'string', enum: ['KITCHEN', 'BAR', 'STORAGE', 'WALKIN_COOLER', 'FREEZER', 'DRY_STORAGE'] },
          storageLocation: { type: 'string' },
        },
      },
      UpdateInventoryItem: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          sku: { type: 'string' },
          categoryId: { type: 'integer' },
          unit: { type: 'string' },
          quantity: { type: 'number' },
          minStock: { type: 'number' },
          maxStock: { type: 'number' },
          price: { type: 'number' },
          supplier: { type: 'string' },
          location: { type: 'string', enum: ['KITCHEN', 'BAR', 'STORAGE', 'WALKIN_COOLER', 'FREEZER', 'DRY_STORAGE'] },
          storageLocation: { type: 'string' },
          status: { type: 'string', enum: ['NORMAL', 'LOW', 'CRITICAL'] },
        },
      },

      // ==== PURCHASING MODELS ====
      PurchaseOrderStatus: {
        type: 'string',
        enum: ['PENDING', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'COMPLETED', 'CANCELLED'],
      },
      Supplier: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          contactPerson: { type: 'string', nullable: true },
          email: { type: 'string', nullable: true },
          phone: { type: 'string', nullable: true },
          address: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          inventoryCategories: { type: 'array', items: { $ref: '#/components/schemas/InventoryCategory' } },
        },
      },
      CreateSupplier: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          contactPerson: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
        },
      },
      UpdateSupplier: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          contactPerson: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
        },
      },
      PurchaseOrder: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          poNumber: { type: 'string' },
          supplierId: { type: 'integer' },
          supplier: { $ref: '#/components/schemas/Supplier' },
          status: { $ref: '#/components/schemas/PurchaseOrderStatus' },
          notes: { type: 'string', nullable: true },
          orderedAt: { type: 'string', format: 'date-time' },
          expectedDeliveryAt: { type: 'string', format: 'date-time', nullable: true },
          items: { type: 'array', items: { $ref: '#/components/schemas/PurchaseOrderItem' } },
        },
      },
      CreatePurchaseOrder: {
        type: 'object',
        required: ['poNumber', 'supplierId', 'items'],
        properties: {
          poNumber: { type: 'string' },
          supplierId: { type: 'integer' },
          status: { $ref: '#/components/schemas/PurchaseOrderStatus' },
          notes: { type: 'string' },
          orderedAt: { type: 'string', format: 'date-time' },
          expectedDeliveryAt: { type: 'string', format: 'date-time' },
          items: { type: 'array', items: { $ref: '#/components/schemas/CreatePurchaseOrderItem' } },
        },
      },
      UpdatePurchaseOrder: {
        type: 'object',
        properties: {
          poNumber: { type: 'string' },
          supplierId: { type: 'integer' },
          status: { $ref: '#/components/schemas/PurchaseOrderStatus' },
          notes: { type: 'string' },
          orderedAt: { type: 'string', format: 'date-time' },
          expectedDeliveryAt: { type: 'string', format: 'date-time' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CreatePurchaseOrderItem' },
            description: 'Array of purchase order items to update or replace. Existing items will be removed and new ones created.',
          },
        },
      },
      PurchaseOrderItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          purchaseOrderId: { type: 'integer' },
          inventoryItemId: { type: 'integer' },
          inventoryItem: { $ref: '#/components/schemas/InventoryItem' },
          quantityOrdered: { type: 'number' },
          quantityReceived: { type: 'number' },
          unitPrice: { type: 'number' },
        },
      },
      CreatePurchaseOrderItem: {
        type: 'object',
        required: ['inventoryItemId', 'quantityOrdered', 'unitPrice'],
        properties: {
          inventoryItemId: { type: 'integer' },
          quantityOrdered: { type: 'number' },
          unitPrice: { type: 'number' },
        },
      },

      // ==== GOODS RECEIVING MODELS ====
      GoodsReceiving: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          grnNumber: { type: 'string' },
          purchaseOrderId: { type: 'integer', nullable: true },
          purchaseOrder: { $ref: '#/components/schemas/PurchaseOrder', nullable: true },
          supplierId: { type: 'integer' },
          supplier: { $ref: '#/components/schemas/Supplier' },
          receivedAt: { type: 'string', format: 'date-time' },
          notes: { type: 'string', nullable: true },
          receivedItems: { type: 'array', items: { $ref: '#/components/schemas/GoodsReceivingItem' } },
        },
      },
      CreateGoodsReceiving: {
        type: 'object',
        required: ['grnNumber', 'supplierId', 'receivedItems'],
        properties: {
          grnNumber: { type: 'string' },
          purchaseOrderId: { type: 'integer' },
          supplierId: { type: 'integer' },
          receivedAt: { type: 'string', format: 'date-time' },
          notes: { type: 'string' },
          receivedItems: { type: 'array', items: { $ref: '#/components/schemas/CreateGoodsReceivingItem' } },
        },
      },
      UpdateGoodsReceiving: {
        type: 'object',
        properties: {
          grnNumber: { type: 'string' },
          purchaseOrderId: { type: 'integer' },
          supplierId: { type: 'integer' },
          receivedAt: { type: 'string', format: 'date-time' },
          notes: { type: 'string' },
          receivedItems: {
            type: 'array',
            items: { $ref: '#/components/schemas/CreateGoodsReceivingItem' },
            description: 'Array of goods receiving items to update or replace. Existing items will be removed and new ones created.',
          },
        },
      },
      GoodsReceivingItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          goodsReceivingId: { type: 'integer' },
          inventoryItemId: { type: 'integer' },
          inventoryItem: { $ref: '#/components/schemas/InventoryItem' },
          quantityReceived: { type: 'number' },
          batchId: { type: 'integer', nullable: true },
          batch: { $ref: '#/components/schemas/Batch', nullable: true },
        },
      },
      CreateGoodsReceivingItem: {
        type: 'object',
        required: ['inventoryItemId', 'quantityReceived'],
        properties: {
          inventoryItemId: { type: 'integer' },
          quantityReceived: { type: 'number' },
          batchNumber: { type: 'string' },
          expiryDate: { type: 'string', format: 'date-time' },
        },
      },
      Batch: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          batchNumber: { type: 'string' },
          inventoryItemId: { type: 'integer' },
          inventoryItem: { $ref: '#/components/schemas/InventoryItem' },
          quantity: { type: 'number' },
          receivedAt: { type: 'string', format: 'date-time' },
          expiryDate: { type: 'string', format: 'date-time', nullable: true },
        },
      },

      // ==== STOCK REQUEST MODELS ====
      StockRequest: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          requestId: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'fulfilled'] },
          requestedBy: { type: 'string', nullable: true },
          requestedFrom: { type: 'string', enum: ['KITCHEN', 'BAR'], nullable: true },
          requestedAt: { type: 'string', format: 'date-time' },
          approvedAt: { type: 'string', format: 'date-time', nullable: true },
          fulfilledAt: { type: 'string', format: 'date-time', nullable: true },
          requestItems: { type: 'array', items: { $ref: '#/components/schemas/StockRequestItem' } },
        },
      },
      StockRequestItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          requestId: { type: 'integer' },
          itemId: { type: 'integer' },
          inventoryItem: { $ref: '#/components/schemas/InventoryItem' },
          quantity: { type: 'number' },
          status: { type: 'string', enum: ['pending', 'approved'] },
        },
      },
      CreateStockRequestInput: {
        type: 'object',
        required: ['requestItems'],
        properties: {
          requestedBy: { type: 'string' },
          requestedFrom: { type: 'string', enum: ['KITCHEN', 'BAR'] },
          requestItems: { type: 'array', items: { $ref: '#/components/schemas/CreateStockRequestItemInput' } },
        },
      },
      CreateStockRequestItemInput: {
        type: 'object',
        required: ['itemId', 'quantity'],
        properties: {
          itemId: { type: 'integer' },
          quantity: { type: 'number' },
        },
      },


      // ==== DEPARTMENT INVENTORY MODELS ====
      DepartmentInventoryItemResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64', description: 'Inventory Item ID' },
          name: { type: 'string', description: 'Inventory Item Name' },
          categoryName: { type: 'string', description: 'Category Name of the Inventory Item' },
          currentStock: { type: 'number', description: 'Current stock in the specified department' },
          departmentInventoryId: { type: 'integer', format: 'int64', nullable: true, description: 'ID of the DepartmentInventory record, null if no stock in department' },
          unit: { type: 'string', description: 'Unit of measure for the inventory item' },
          department: { type: 'string', enum: ['KITCHEN', 'BAR', 'SERVICE', 'OPERATIONS', 'MANAGEMENT'], description: 'Department name' },
        },
      },
      UpdateDepartmentInventoryRequest: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: { type: 'number', description: 'The new quantity for the inventory item in the department' },
        },
      },

      // ==== TABLE MODELS ====
      Table: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          number: { type: 'integer' },
          capacity: { type: 'integer' },
          status: { type: 'string', enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED'] },
        },
      },
      CreateTable: {
        type: 'object',
        required: ['number', 'capacity'],
        properties: {
          number: { type: 'integer' },
          capacity: { type: 'integer' },
          status: { type: 'string', enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED'] },
        },
      },
      UpdateTable: {
        type: 'object',
        properties: {
          number: { type: 'integer' },
          capacity: { type: 'integer' },
          status: { type: 'string', enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED'] },
        },
      },

      // ==== RESERVATION MODELS ====
      Reservation: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          customerName: { type: 'string' },
          customerPhone: { type: 'string' },
          customerEmail: { type: 'string', nullable: true },
          date: { type: 'string', format: 'date-time' },
          numberOfGuests: { type: 'integer' },
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] },
          notes: { type: 'string', nullable: true },
          tables: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                table: { $ref: '#/components/schemas/Table' }
              }
            }
          }
        },
      },
      CreateReservation: {
        type: 'object',
        required: ['customerName', 'customerPhone', 'date', 'numberOfGuests', 'tableIds'],
        properties: {
          customerName: { type: 'string' },
          customerPhone: { type: 'string' },
          customerEmail: { type: 'string', nullable: true },
          date: { type: 'string', format: 'date-time' },
          numberOfGuests: { type: 'integer' },
          notes: { type: 'string', nullable: true },
          tableIds: { type: 'array', items: { type: 'integer' } },
        },
      },
      UpdateReservation: {
        type: 'object',
        properties: {
          customerName: { type: 'string' },
          customerPhone: { type: 'string' },
          customerEmail: { type: 'string', nullable: true },
          date: { type: 'string', format: 'date-time' },
          numberOfGuests: { type: 'integer' },
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] },
          notes: { type: 'string', nullable: true },
          tableIds: { type: 'array', items: { type: 'integer' } },
        },
      },

      // ==== PAYMENT MODELS ====
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          orderId: { type: 'integer' },
          amount: { type: 'number' },
          paymentMethod: { type: 'string', enum: ['CASH', 'CARD', 'ONLINE'] },
          status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED'] },
          transactionId: { type: 'string', nullable: true },
        },
      },
      CreatePayment: {
        type: 'object',
        required: ['orderId', 'amount', 'paymentMethod'],
        properties: {
          orderId: { type: 'integer' },
          amount: { type: 'number' },
          paymentMethod: { type: 'string', enum: ['CASH', 'CARD', 'ONLINE'] },
          transactionId: { type: 'string' },
        },
      },

      // ==== USER MODELS ====
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          username: { type: 'string' },
          email: { type: 'string', nullable: true },
          staffId: { type: 'integer', nullable: true },
          userGroupId: { type: 'integer', nullable: true },
          isActive: { type: 'boolean' },
          lastLogin: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          staff: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              firstName: { type: 'string' },
              lastName: { type: 'string' }
            },
            nullable: true
          },
          userGroup: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' }
            },
            nullable: true
          },
        },
      },
      CreateUser: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', description: 'Unique username for the user' },
          email: { type: 'string', description: 'Email address (optional)' },
          password: { type: 'string', description: 'User password' },
          staffId: { type: 'integer', description: 'Associated staff member ID (optional)' },
          userGroupId: { type: 'integer', description: 'User group/role ID' },
        },
      },
      UpdateUser: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          staffId: { type: 'integer', nullable: true },
          userGroupId: { type: 'integer', nullable: true },
          isActive: { type: 'boolean' },
          permissionOverrides: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                permissionId: { type: 'integer' },
                allowed: { type: 'boolean' }
              }
            }
          },
        },
      },
      ChangePassword: {
        type: 'object',
        required: ['newPassword'],
        properties: {
          newPassword: { type: 'string', description: 'New password for the user' },
        },
      },
      UpdateUserPermission: {
        type: 'object',
        required: ['allowed'],
        properties: {
          allowed: { type: 'boolean', description: 'Whether the permission is granted' },
        },
      },

      // ==== STAFF MODELS ====
      Staff: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', nullable: true },
          phone: { type: 'string', nullable: true },
          address: { type: 'string', nullable: true },
          roleId: { type: 'integer', nullable: true },
          role: { $ref: '#/components/schemas/StaffRole', nullable: true },
          departmentId: { type: 'integer', nullable: true },
          department: { $ref: '#/components/schemas/Department', nullable: true },
          hireDate: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'] },
          imageUrl: { type: 'string', nullable: true },
          emergencyContact: { type: 'string', nullable: true },
          notes: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateStaff: {
        type: 'object',
        required: ['firstName', 'lastName', 'hireDate'],
        properties: {
          firstName: { type: 'string', description: 'First name of the staff member' },
          lastName: { type: 'string', description: 'Last name of the staff member' },
          email: { type: 'string', description: 'Email address (optional)' },
          phone: { type: 'string', description: 'Phone number (optional)' },
          address: { type: 'string', description: 'Address (optional)' },
          roleId: { type: 'integer', description: 'Staff role ID (optional)' },
          departmentId: { type: 'integer', description: 'Department ID (optional)' },
          hireDate: { type: 'string', format: 'date', description: 'Hire date (YYYY-MM-DD)' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'], description: 'Staff status' },
          imageUrl: { type: 'string', description: 'Profile image URL (optional)' },
          emergencyContact: { type: 'string', description: 'Emergency contact info (optional)' },
          notes: { type: 'string', description: 'Additional notes (optional)' },
        },
      },
      UpdateStaff: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
          roleId: { type: 'integer', nullable: true },
          departmentId: { type: 'integer', nullable: true },
          hireDate: { type: 'string', format: 'date' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'] },
          imageUrl: { type: 'string' },
          emergencyContact: { type: 'string' },
          notes: { type: 'string' },
        },
      },
      StaffRole: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          departmentId: { type: 'integer', nullable: true },
          department: { $ref: '#/components/schemas/Department', nullable: true },
        },
      },
      CreateStaffRole: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', description: 'Name of the staff role' },
          description: { type: 'string', description: 'Role description (optional)' },
          departmentId: { type: 'integer', description: 'Department ID (optional)' },
        },
      },
      UpdateStaffRole: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          departmentId: { type: 'integer', nullable: true },
        },
      },
      Department: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
        },
      },
      CreateDepartment: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', description: 'Name of the department' },
          description: { type: 'string', description: 'Department description (optional)' },
        },
      },
      UpdateDepartment: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  },
  paths: {
    // ==== AUTH PATHS ====
    '/auth/login': {
      post: {
        summary: 'User login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                    permissions: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Refresh access token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Token refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                    permissions: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Invalid or expired refresh token',
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'User logout',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Logged out successfully',
          },
        },
      },
    },

    '/users': {
      get: {
        summary: 'Get all users',
        tags: ['Users'],
        responses: {
          200: {
            description: 'List of all users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new user',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUser' },
            },
          },
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get user by ID',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'User found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          404: {
            description: 'User not found',
          },
        },
      },
      put: {
        summary: 'Update user',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUser' },
            },
          },
        },
        responses: {
          200: {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          404: {
            description: 'User not found',
          },
        },
      },
      delete: {
        summary: 'Delete user',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'User deleted successfully',
          },
        },
      },
    },
    '/users/{id}/change-password': {
      post: {
        summary: 'Change user password',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangePassword' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password changed successfully',
          },
        },
      },
    },
    '/users/{id}/permissions': {
      get: {
        summary: 'Get effective permissions for user',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'List of permission strings',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    '/users/{id}/permissions/{permissionId}': {
      put: {
        summary: 'Update a specific permission for user',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
          {
            name: 'permissionId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserPermission' },
            },
          },
        },
        responses: {
          200: {
            description: 'Permission updated successfully',
          },
        },
      },
    },

    // ==== STAFF PATHS ====
    '/staff': {
      get: {
        summary: 'Get all staff members',
        tags: ['Staff'],
        responses: {
          200: {
            description: 'List of all staff members',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Staff' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new staff member',
        tags: ['Staff'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateStaff' },
            },
          },
        },
        responses: {
          201: {
            description: 'Staff member created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Staff' },
              },
            },
          },
        },
      },
    },
    '/staff/{id}': {
      get: {
        summary: 'Get staff member by ID',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Staff member ID',
          },
        ],
        responses: {
          200: {
            description: 'Staff member found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Staff' },
              },
            },
          },
          404: {
            description: 'Staff member not found',
          },
        },
      },
      put: {
        summary: 'Update staff member',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Staff member ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateStaff' },
            },
          },
        },
        responses: {
          200: {
            description: 'Staff member updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Staff' },
              },
            },
          },
          404: {
            description: 'Staff member not found',
          },
        },
      },
      delete: {
        summary: 'Delete staff member',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Staff member ID',
          },
        ],
        responses: {
          204: {
            description: 'Staff member deleted successfully',
          },
          404: {
            description: 'Staff member not found',
          },
        },
      },
    },
    '/staff/upload': {
      post: {
        summary: 'Upload staff member image',
        tags: ['Staff'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Image uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    imageUrl: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ==== STAFF ROLE PATHS ====
    '/staff-roles': {
      get: {
        summary: 'Get all staff roles',
        tags: ['Staff'],
        responses: {
          200: {
            description: 'List of all staff roles',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/StaffRole' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new staff role',
        tags: ['Staff'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateStaffRole' },
            },
          },
        },
        responses: {
          201: {
            description: 'Staff role created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StaffRole' },
              },
            },
          },
        },
      },
    },
    '/staff-roles/{id}': {
      get: {
        summary: 'Get staff role by ID',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Staff role ID',
          },
        ],
        responses: {
          200: {
            description: 'Staff role found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StaffRole' },
              },
            },
          },
          404: {
            description: 'Staff role not found',
          },
        },
      },
      put: {
        summary: 'Update staff role',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Staff role ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateStaffRole' },
            },
          },
        },
        responses: {
          200: {
            description: 'Staff role updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StaffRole' },
              },
            },
          },
          404: {
            description: 'Staff role not found',
          },
        },
      },
      delete: {
        summary: 'Delete staff role',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Staff role ID',
          },
        ],
        responses: {
          204: {
            description: 'Staff role deleted successfully',
          },
          404: {
            description: 'Staff role not found',
          },
        },
      },
    },

    // ==== DEPARTMENT PATHS ====
    '/departments': {
      get: {
        summary: 'Get all departments',
        tags: ['Staff'],
        responses: {
          200: {
            description: 'List of all departments',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Department' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new department',
        tags: ['Staff'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDepartment' },
            },
          },
        },
        responses: {
          201: {
            description: 'Department created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Department' },
              },
            },
          },
        },
      },
    },
    '/departments/{id}': {
      get: {
        summary: 'Get department by ID',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Department ID',
          },
        ],
        responses: {
          200: {
            description: 'Department found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Department' },
              },
            },
          },
          404: {
            description: 'Department not found',
          },
        },
      },
      put: {
        summary: 'Update department',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Department ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateDepartment' },
            },
          },
        },
        responses: {
          200: {
            description: 'Department updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Department' },
              },
            },
          },
          404: {
            description: 'Department not found',
          },
        },
      },
      delete: {
        summary: 'Delete department',
        tags: ['Staff'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Department ID',
          },
        ],
        responses: {
          204: {
            description: 'Department deleted successfully',
          },
          404: {
            description: 'Department not found',
          },
        },
      },
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.ts', './dist/src/modules/**/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Setup swagger UI
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;