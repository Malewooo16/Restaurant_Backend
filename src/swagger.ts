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
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
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
          category: {
            type: 'string',
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
        },
      },
      CreateMenuItem: {
        type: 'object',
        required: ['name', 'price', 'prepArea'],
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
          category: {
            type: 'string',
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
          category: {
            type: 'string',
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
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            format: 'int64',
          },
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
              $ref: '#/components/schemas/OrderItem',
            },
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
          menuItemId: {
            type: 'integer',
          },
          quantity: {
            type: 'integer',
          },
          notes: {
            type: 'string',
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
          menuItem: {
            $ref: '#/components/schemas/MenuItem',
          },
          quantity: {
            type: 'integer',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'PREPARING', 'READY'],
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
          menuItem: {
            $ref: '#/components/schemas/MenuItem',
          },
          quantity: {
            type: 'integer',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'READY'],
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
