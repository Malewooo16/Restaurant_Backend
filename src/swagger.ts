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
      Order: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          orderNumber: {
            type: 'integer',
          },
          tableNumber: {
            type: 'integer',
            nullable: true,
          },
          customerName: {
            type: 'string',
            nullable: true,
          },
          waiter: {
            type: 'string',
            nullable: true,
          },
          guestCount: {
            type: 'integer',
            nullable: true,
          },
          total: {
            type: 'number',
            nullable: true,
          },
          status: {
            type: 'string',
            enum: [
              'PENDING',
              'IN_PROGRESS',
              'COMPLETED',
              'SERVED',
              'PAID',
              'CANCELLED',
            ],
          },
          orderItems: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem',
            },
          },
          kitchenOrder: {
            $ref: '#/components/schemas/KitchenOrder',
            nullable: true,
          },
          barOrder: {
            $ref: '#/components/schemas/BarOrder',
            nullable: true,
          },
        },
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          orderId: {
            type: 'integer',
          },
          menuItemId: {
            type: 'integer',
          },
          quantity: {
            type: 'integer',
          },
          price: {
            type: 'number',
          },
          notes: {
            type: 'string',
            nullable: true,
          },
          selectedSideDishes: {
            type: 'array',
            items: {
              type: 'integer',
            },
          },
          selectedAddons: {
            type: 'array',
            items: {
              type: 'integer',
            },
          },
          prepArea: {
            type: 'string',
            enum: ['KITCHEN', 'BAR'],
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'],
          },
          kitchenOrderId: {
            type: 'integer',
            nullable: true,
          },
          barOrderId: {
            type: 'integer',
            nullable: true,
          },
        },
      },
      CreateOrder: {
        type: 'object',
        required: ['orderItems'],
        properties: {
          tableNumber: {
            type: 'integer',
          },
          customerName: {
            type: 'string',
          },
          waiter: {
            type: 'string',
          },
          guestCount: {
            type: 'integer',
          },
          orderItems: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/CreateOrderItem',
            },
          },
        },
      },
      CreateOrderItem: {
        type: 'object',
        required: ['menuItemId', 'quantity'],
        properties: {
          menuItemId: {
            type: 'integer',
          },
          quantity: {
            type: 'integer',
          },
          notes: {
            type: 'string',
          },
          selectedSideDishes: {
            type: 'array',
            items: {
              type: 'integer',
            },
            description: 'Array of MenuSideDish IDs',
          },
          selectedAddons: {
            type: 'array',
            items: {
              type: 'integer',
            },
            description: 'Array of MenuAddon IDs',
          },
        },
      },
      UpdateOrder: {
        type: 'object',
        properties: {
          tableNumber: {
            type: 'integer',
          },
          customerName: {
            type: 'string',
          },
          waiter: {
            type: 'string',
          },
          guestCount: {
            type: 'integer',
          },
          status: {
            type: 'string',
            enum: [
              'PENDING',
              'IN_PROGRESS',
              'COMPLETED',
              'SERVED',
              'PAID',
              'CANCELLED',
            ],
          },
          orderItems: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/CreateOrderItem',
            },
            description: 'Optional array of order items to update or replace. Existing items will be removed and new ones created.',
          },
        },
      },
      KitchenOrder: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          orderId: {
            type: 'integer',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'PREPARING', 'READY', 'CANCELLED'],
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem',
            },
          },
        },
      },
      BarOrder: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          orderId: {
            type: 'integer',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'READY', 'CANCELLED'],
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem',
            },
          },
        },
      },
      OrderItemWithDetails: {
        allOf: [
          {
            $ref: '#/components/schemas/OrderItem',
          },
          {
            type: 'object',
            properties: {
              menuItem: {
                $ref: '#/components/schemas/MenuItem',
              },
            },
          },
        ],
      },
      KitchenOrderWithDetails: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          orderId: {
            type: 'integer',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'PREPARING', 'READY', 'CANCELLED'],
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItemWithDetails',
            },
          },
          order: {
            $ref: '#/components/schemas/Order',
          },
        },
      },
      UpdateKitchenOrderStatus: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'PREPARING', 'READY'],
          },
        },
      },
      UpdateBarOrderStatus: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'READY'],
          },
        },
      },
      UpdateOrderItemStatus: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'],
          },
        },
      },
      MenuCategory: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          isActive: {
            type: 'boolean',
          },
        },
      },
      CreateMenuCategory: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          isActive: {
            type: 'boolean',
          },
        },
      },
      UpdateMenuCategory: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          isActive: {
            type: 'boolean',
          },
        },
      },
      MenuAddon: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          isAvailable: {
            type: 'boolean',
          },
        },
      },
      CreateMenuAddon: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          isAvailable: {
            type: 'boolean',
          },
        },
      },
      UpdateMenuAddon: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          isAvailable: {
            type: 'boolean',
          },
        },
      },
      MenuSideDish: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          isAvailable: {
            type: 'boolean',
          },
        },
      },
      CreateMenuSideDish: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          isAvailable: {
            type: 'boolean',
          },
        },
      },
      UpdateMenuSideDish: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          isAvailable: {
            type: 'boolean',
          },
        },
      },
      // Updated MenuItem schemas
      MenuItem: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          isAvailable: {
            type: 'boolean',
          },
          prepArea: {
            type: 'string',
            enum: ['KITCHEN', 'BAR'],
          },
          categoryId: { // Added categoryId
            type: 'integer',
          },
          menuCategory: { // Added menuCategory relation
            $ref: '#/components/schemas/MenuCategory',
          },
          rating: {
            type: 'number',
          },
          cost: {
            type: 'number',
          },
          prepTime: {
            type: 'number',
          },
          calories: {
            type: 'number',
          },
          servingSize: {
            type: 'string',
          },
          ingredients: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          allergens: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          dietaryOptions: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          featured: {
            type: 'boolean',
          },
          seasonal: {
            type: 'boolean',
          },
          addons: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/MenuAddon',
            },
          },
          sideDishes: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/MenuSideDish',
            },
          },
        },
      },
      CreateMenuItem: {
        type: 'object',
        required: ['name', 'price', 'prepArea', 'categoryId'], // Added categoryId to required
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          isAvailable: {
            type: 'boolean',
          },
          prepArea: {
            type: 'string',
            enum: ['KITCHEN', 'BAR'],
          },
          categoryId: { // Added categoryId
            type: 'integer',
          },
          rating: {
            type: 'number',
          },
          cost: {
            type: 'number',
          },
          prepTime: {
            type: 'number',
          },
          calories: {
            type: 'number',
          },
          servingSize: {
            type: 'string',
          },
          ingredients: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          allergens: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          dietaryOptions: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          featured: {
            type: 'boolean',
          },
          seasonal: {
            type: 'boolean',
          },
          addonIds: {
            type: 'array',
            items: {
              type: 'integer',
            },
            description: 'Array of MenuAddon IDs to associate with this menu item.',
          },
          sideDishIds: {
            type: 'array',
            items: {
              type: 'integer',
            },
            description: 'Array of MenuSideDish IDs to associate with this menu item.',
          },
        },
      },
      UpdateMenuItem: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          isAvailable: {
            type: 'boolean',
          },
          prepArea: {
            type: 'string',
            enum: ['KITCHEN', 'BAR'],
          },
          categoryId: { // Added categoryId
            type: 'integer',
          },
          rating: {
            type: 'number',
          },
          cost: {
            type: 'number',
          },
          prepTime: {
            type: 'number',
          },
          calories: {
            type: 'number',
          },
          servingSize: {
            type: 'string',
          },
          ingredients: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          allergens: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          dietaryOptions: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          featured: {
            type: 'boolean',
          },
          seasonal: {
            type: 'boolean',
          },
          addonIds: {
            type: 'array',
            items: {
              type: 'integer',
            },
            description: 'Array of MenuAddon IDs to associate with this menu item.',
          },
          sideDishIds: {
            type: 'array',
            items: {
              type: 'integer',
            },
            description: 'Array of MenuSideDish IDs to associate with this menu item.',
          },
        },
      },
      InventoryCategory: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          isActive: {
            type: 'boolean',
          },
        },
      },
      CreateInventoryCategory: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
        },
      },
      UpdateInventoryCategory: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          isActive: {
            type: 'boolean',
          },
        },
      },
      InventoryUnit: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          unit: {
            type: 'string',
          },
          plural: {
            type: 'string',
          },
          symbol: {
            type: 'string',
          },
        },
      },
      CreateInventoryUnit: {
        type: 'object',
        required: ['name', 'unit', 'plural', 'symbol'],
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          unit: {
            type: 'string',
          },
          plural: {
            type: 'string',
          },
          symbol: {
            type: 'string',
          },
        },
      },
      UpdateInventoryUnit: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          unit: {
            type: 'string',
          },
          plural: {
            type: 'string',
          },
          symbol: {
            type: 'string',
          },
        },
      },
      InventoryItem: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          sku: {
            type: 'string',
          },
          category: {
            type: 'string',
          },
          unit: {
            type: 'string',
          },
          quantity: {
            type: 'number',
          },
          minStock: {
            type: 'number',
          },
          maxStock: {
            type: 'number',
          },
          price: {
            type: 'number',
          },
          supplier: {
            type: 'string',
          },
          location: {
            type: 'string',
            enum: [
              'KITCHEN',
              'BAR',
              'STORAGE',
              'WALKIN_COOLER',
              'FREEZER',
              'DRY_STORAGE',
            ],
          },
          storageLocation: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['NORMAL', 'LOW', 'CRITICAL'],
          },
        },
      },
      CreateInventoryItem: {
        type: 'object',
        required: ['name', 'category', 'unit'],
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          sku: {
            type: 'string',
          },
          category: {
            type: 'string',
          },
          unit: {
            type: 'string',
          },
          quantity: {
            type: 'number',
          },
          minStock: {
            type: 'number',
          },
          maxStock: {
            type: 'number',
          },
          price: {
            type: 'number',
          },
          supplier: {
            type: 'string',
          },
          location: {
            type: 'string',
            enum: [
              'KITCHEN',
              'BAR',
              'STORAGE',
              'WALKIN_COOLER',
              'FREEZER',
              'DRY_STORAGE',
            ],
          },
          storageLocation: {
            type: 'string',
          },
        },
      },
      UpdateInventoryItem: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          sku: {
            type: 'string',
          },
          category: {
            type: 'string',
          },
          unit: {
            type: 'string',
          },
          quantity: {
            type: 'number',
          },
          minStock: {
            type: 'number',
          },
          maxStock: {
            type: 'number',
          },
          price: {
            type: 'number',
          },
          supplier: {
            type: 'string',
          },
          location: {
            type: 'string',
            enum: [
              'KITCHEN',
              'BAR',
              'STORAGE',
              'WALKIN_COOLER',
              'FREEZER',
              'DRY_STORAGE',
            ],
          },
          storageLocation: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['NORMAL', 'LOW', 'CRITICAL'],
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
