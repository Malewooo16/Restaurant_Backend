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
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.ts', './src/modules/**/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Setup swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec));

export default router;