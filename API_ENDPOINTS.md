# APOTEk Restaurant API Endpoints Documentation

## Base URL
`http://localhost:3000/api`

## Menu Endpoints

### 1. Get All Menu Items
- **Endpoint**: `GET /menu`
- **Description**: Retrieves all menu items from the database
- **Response**: Array of menu item objects
- **Example Response**:
```json
[
  {
    "id": 1,
    "name": "Beef Burger",
    "description": "Grilled beef burger",
    "price": 8,
    "isAvailable": true,
    "prepArea": "KITCHEN",
    "category": null,
    "rating": 0,
    "cost": null,
    "prepTime": null,
    "calories": null,
    "servingSize": null,
    "ingredients": [],
    "allergens": [],
    "dietaryOptions": [],
    "featured": false,
    "seasonal": false,
    "createdAt": "2026-01-14T12:22:37.305Z",
    "updatedAt": "2026-01-14T12:22:37.305Z"
  },
  {
    "id": 2,
    "name": "Fries",
    "description": "Crispy french fries",
    "price": 3,
    "isAvailable": true,
    "prepArea": "KITCHEN",
    "category": null,
    "rating": 0,
    "cost": null,
    "prepTime": null,
    "calories": null,
    "servingSize": null,
    "ingredients": [],
    "allergens": [],
    "dietaryOptions": [],
    "featured": false,
    "seasonal": false,
    "createdAt": "2026-01-14T12:22:39.915Z",
    "updatedAt": "2026-01-14T12:22:39.915Z"
  }
]
```

### 2. Get Menu Item by ID
- **Endpoint**: `GET /menu/:id`
- **Description**: Retrieves a specific menu item by its ID
- **Parameters**:
  - `id` (URL parameter) - The ID of the menu item
- **Response**: Menu item object
- **Example Response**:
```json
{
  "id": 1,
  "name": "Beef Burger",
  "description": "Grilled beef burger",
  "price": 8,
  "isAvailable": true,
  "prepArea": "KITCHEN",
  "category": null,
  "rating": 0,
  "cost": null,
  "prepTime": null,
  "calories": null,
  "servingSize": null,
  "ingredients": [],
  "allergens": [],
  "dietaryOptions": [],
  "featured": false,
  "seasonal": false,
  "createdAt": "2026-01-14T12:22:37.305Z",
  "updatedAt": "2026-01-14T12:22:37.305Z"
}
```

### 3. Create Menu Item
- **Endpoint**: `POST /menu`
- **Description**: Creates a new menu item
- **Request Body**: Menu item object (requires validation)
- **Response**: Created menu item object
- **Example Request**:
```json
{
  "name": "New Dish",
  "description": "Description of the new dish",
  "price": 12.99,
  "isAvailable": true,
  "prepArea": "KITCHEN"
}
```

### 4. Update Menu Item
- **Endpoint**: `PUT /menu/:id`
- **Description**: Updates an existing menu item
- **Parameters**:
  - `id` (URL parameter) - The ID of the menu item to update
- **Request Body**: Menu item object with updated fields (requires validation)
- **Response**: Updated menu item object

### 5. Delete Menu Item
- **Endpoint**: `DELETE /menu/:id`
- **Description**: Deletes a menu item
- **Parameters**:
  - `id` (URL parameter) - The ID of the menu item to delete
- **Response**: Success message

## Error Handling

The API provides appropriate error responses:

- **404 Not Found**: When requesting a non-existent menu item
  ```json
  {
    "message": "Menu item not found"
  }
  ```
- **400 Bad Request**: When validation fails for POST/PUT requests
- **500 Internal Server Error**: For unexpected server errors

## Testing with cURL

Here are examples of how to test the endpoints using cURL:

```bash
# Get all menu items
curl -X GET http://localhost:3000/api/menu

# Get specific menu item
curl -X GET http://localhost:3000/api/menu/1

# Test error handling
curl -X GET http://localhost:3000/api/menu/9999
```

## Order Endpoints

### 1. Get All Orders
- **Endpoint**: `GET /api/order`
- **Description**: Retrieves all orders from the database
- **Response**: Array of order objects with their items, kitchen orders, and bar orders
- **Example Response**:
```json
[
  {
    "id": 11000,
    "orderNumber": 1024,
    "tableNumber": 5,
    "status": "IN_PROGRESS",
    "customerName": null,
    "waiter": null,
    "guestCount": null,
    "total": 0,
    "createdAt": "2026-01-14T12:22:40.497Z",
    "updatedAt": "2026-01-14T12:22:40.497Z",
    "orderItems": [
      {
        "id": 1,
        "orderId": 11000,
        "menuItemId": 1,
        "quantity": 1,
        "price": 8,
        "notes": "No onions",
        "prepArea": "KITCHEN",
        "status": "PENDING",
        "createdAt": "2026-01-14T12:22:40.820Z",
        "updatedAt": "2026-01-14T12:22:42.766Z",
        "kitchenOrderId": 11000,
        "barOrderId": null
      }
    ],
    "kitchenOrder": {
      "id": 11000,
      "orderId": 11000,
      "status": "PENDING",
      "createdAt": "2026-01-14T12:22:42.766Z",
      "updatedAt": "2026-01-14T12:22:42.766Z"
    },
    "barOrder": {
      "id": 11000,
      "orderId": 11000,
      "status": "PENDING",
      "createdAt": "2026-01-14T12:22:43.943Z",
      "updatedAt": "2026-01-14T12:22:43.943Z"
    }
  }
]
```

### 2. Get Order by ID
- **Endpoint**: `GET /api/order/:id`
- **Description**: Retrieves a specific order by its ID
- **Parameters**:
  - `id` (URL parameter) - The ID of the order
- **Response**: Order object with items, kitchen order, and bar order
- **Example Response**: (Same structure as above but for a single order)

### 3. Create Order
- **Endpoint**: `POST /api/order`
- **Description**: Creates a new order
- **Request Body**: Order object with order items
- **Example Request**:
```json
{
  "tableNumber": 1,
  "customerName": "Test Customer",
  "orderItems": [
    {
      "menuItemId": 1,
      "quantity": 2,
      "notes": "Well done"
    },
    {
      "menuItemId": 3,
      "quantity": 1,
      "notes": "Extra mint"
    }
  ]
}
```
- **Response**: Created order object

### 4. Update Order
- **Endpoint**: `PATCH /api/order/:id`
- **Description**: Updates an existing order
- **Parameters**:
  - `id` (URL parameter) - The ID of the order to update
- **Request Body**: Order object with updated fields
- **Example Request**:
```json
{
  "status": "IN_PROGRESS"
}
```
- **Response**: Updated order object

### 5. Get All Kitchen Orders
- **Endpoint**: `GET /api/order/kitchen-orders`
- **Description**: Retrieves all kitchen orders from the database
- **Response**: Array of kitchen order objects with their items
- **Example Response**:
```json
[
  {
    "id": 11000,
    "orderId": 11000,
    "status": "PENDING",
    "createdAt": "2026-01-14T12:22:42.766Z",
    "updatedAt": "2026-01-14T12:22:42.766Z",
    "items": [
      {
        "id": 1,
        "orderId": 11000,
        "menuItemId": 1,
        "quantity": 1,
        "price": 8,
        "notes": "No onions",
        "prepArea": "KITCHEN",
        "status": "PENDING",
        "createdAt": "2026-01-14T12:22:40.820Z",
        "updatedAt": "2026-01-14T12:22:42.766Z",
        "kitchenOrderId": 11000,
        "barOrderId": null
      },
      {
        "id": 2,
        "orderId": 11000,
        "menuItemId": 2,
        "quantity": 1,
        "price": 3,
        "notes": null,
        "prepArea": "KITCHEN",
        "status": "PENDING",
        "createdAt": "2026-01-14T12:22:40.820Z",
        "updatedAt": "2026-01-14T12:22:42.766Z",
        "kitchenOrderId": 11000,
        "barOrderId": null
      }
    ]
  },
  {
    "id": 11001,
    "orderId": 11001,
    "status": "PREPARING",
    "createdAt": "2026-01-19T09:17:58.061Z",
    "updatedAt": "2026-01-19T09:22:14.979Z",
    "items": []
  }
]
```

### 6. Get All Bar Orders
- **Endpoint**: `GET /api/order/bar-orders`
- **Description**: Retrieves all bar orders from the database
- **Response**: Array of bar order objects with their items
- **Example Response**:
```json
[
  {
    "id": 11000,
    "orderId": 11000,
    "status": "PENDING",
    "createdAt": "2026-01-14T12:22:43.943Z",
    "updatedAt": "2026-01-14T12:22:43.943Z",
    "items": [
      {
        "id": 3,
        "orderId": 11000,
        "menuItemId": 3,
        "quantity": 1,
        "price": 5,
        "notes": "Less sugar",
        "prepArea": "BAR",
        "status": "PENDING",
        "createdAt": "2026-01-14T12:22:40.820Z",
        "updatedAt": "2026-01-14T12:22:43.943Z",
        "kitchenOrderId": null,
        "barOrderId": 11000
      }
    ]
  },
  {
    "id": 11001,
    "orderId": 11001,
    "status": "READY",
    "createdAt": "2026-01-19T09:17:58.061Z",
    "updatedAt": "2026-01-19T09:22:32.345Z",
    "items": []
  }
]

### 6. Get Kitchen Order by ID
- **Endpoint**: `GET /api/order/kitchen-orders/:id`
- **Description**: Retrieves a specific kitchen order by its ID
- **Parameters**:
  - `id` (URL parameter) - The ID of the kitchen order
- **Response**: Kitchen order object with items
- **Example Response**:
```json
{
  "id": 11001,
  "orderId": 11001,
  "status": "PREPARING",
  "createdAt": "2026-01-19T09:17:58.061Z",
  "updatedAt": "2026-01-19T09:22:14.979Z",
  "items": []
}
```

### 7. Get Bar Order by ID
- **Endpoint**: `GET /api/order/bar-orders/:id`
- **Description**: Retrieves a specific bar order by its ID
- **Parameters**:
  - `id` (URL parameter) - The ID of the bar order
- **Response**: Bar order object with items
- **Example Response**:
```json
{
  "id": 11001,
  "orderId": 11001,
  "status": "READY",
  "createdAt": "2026-01-19T09:17:58.061Z",
  "updatedAt": "2026-01-19T09:22:32.345Z",
  "items": []
}
```

### 8. Update Kitchen Order Status
- **Endpoint**: `PATCH /api/order/kitchen-orders/:id`
- **Description**: Updates the status of a kitchen order
- **Parameters**:
  - `id` (URL parameter) - The ID of the kitchen order to update
- **Request Body**: Kitchen order status update
- **Example Request**:
```json
{
  "status": "PREPARING"
}
```
- **Response**: Updated kitchen order object

### 9. Update Bar Order Status
- **Endpoint**: `PATCH /api/order/bar-orders/:id`
- **Description**: Updates the status of a bar order
- **Parameters**:
  - `id` (URL parameter) - The ID of the bar order to update
- **Request Body**: Bar order status update
- **Example Request**:
```json
{
  "status": "READY"
}
```
- **Response**: Updated bar order object

## Response Codes
- `200 OK`: Successful GET requests
- `201 Created`: Successful POST requests
- `200 OK`: Successful PATCH requests
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side errors

## Testing with cURL

Here are examples of how to test the order endpoints using cURL:

```bash
# Get all orders
curl -X GET http://localhost:3000/api/order

# Get specific order
curl -X GET http://localhost:3000/api/order/11001

# Create new order
curl -X POST http://localhost:3000/api/order \
  -H "Content-Type: application/json" \
  -d '{"tableNumber": 1, "customerName": "Test Customer", "orderItems": [{"menuItemId": 1, "quantity": 2}, {"menuItemId": 3, "quantity": 1}]}'

# Update order status
curl -X PATCH http://localhost:3000/api/order/11001 \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}'

# Get kitchen order
curl -X GET http://localhost:3000/api/order/kitchen-orders/11001

# Get bar order
curl -X GET http://localhost:3000/api/order/bar-orders/11001

# Update kitchen order status
curl -X PATCH http://localhost:3000/api/order/kitchen-orders/11001 \
  -H "Content-Type: application/json" \
  -d '{"status": "PREPARING"}'

# Update bar order status
curl -X PATCH http://localhost:3000/api/order/bar-orders/11001 \
  -H "Content-Type: application/json" \
  -d '{"status": "READY"}'

# Get all kitchen orders
curl -X GET http://localhost:3000/api/order/kitchen-orders

# Get all bar orders
curl -X GET http://localhost:3000/api/order/bar-orders
```

## Complete Testing Results

### ✅ Successfully Tested Endpoints:

1. **GET /api/order** - ✅ Working
   ```bash
   curl -X GET http://localhost:3000/api/order
   ```

2. **POST /api/order** - ✅ Working
   ```bash
   curl -X POST http://localhost:3000/api/order \
     -H "Content-Type: application/json" \
     -d '{"tableNumber": 1, "customerName": "Test Customer", "orderItems": [{"menuItemId": 1, "quantity": 2, "notes": "Well done"}, {"menuItemId": 3, "quantity": 1, "notes": "Extra mint"}]}'
   ```

3. **GET /api/order/:id** - ✅ Working
   ```bash
   curl -X GET http://localhost:3000/api/order/11001
   ```

4. **PATCH /api/order/:id** - ✅ Working
   ```bash
   curl -X PATCH http://localhost:3000/api/order/11001 \
     -H "Content-Type: application/json" \
     -d '{"status": "IN_PROGRESS"}'
   ```

5. **GET /api/order/kitchen-orders** - ✅ Working (FIXED)
   ```bash
   curl -X GET http://localhost:3000/api/order/kitchen-orders
   ```

6. **GET /api/order/bar-orders** - ✅ Working (FIXED)
   ```bash
   curl -X GET http://localhost:3000/api/order/bar-orders
   ```

7. **GET /api/order/kitchen-orders/:id** - ✅ Working
   ```bash
   curl -X GET http://localhost:3000/api/order/kitchen-orders/11001
   ```

8. **GET /api/order/bar-orders/:id** - ✅ Working
   ```bash
   curl -X GET http://localhost:3000/api/order/bar-orders/11001
   ```

9. **PATCH /api/order/kitchen-orders/:id** - ✅ Working
   ```bash
   curl -X PATCH http://localhost:3000/api/order/kitchen-orders/11001 \
     -H "Content-Type: application/json" \
     -d '{"status": "PREPARING"}'
   ```

10. **PATCH /api/order/bar-orders/:id** - ✅ Working
   ```bash
   curl -X PATCH http://localhost:3000/api/order/bar-orders/11001 \
     -H "Content-Type: application/json" \
     -d '{"status": "READY"}'
   ```

### ❌ Endpoints with Issues:

1. **DELETE /api/order/:id** - ❌ Foreign key constraint
   - Issue: Cannot delete orders with related order items
   - Error: "Foreign key constraint violated on the constraint: `OrderItem_orderId_fkey`"

### 📝 Example Responses:

**Successful Order Creation Response:**
```json
{
  "id": 11001,
  "orderNumber": 1001,
  "tableNumber": 1,
  "status": "PENDING",
  "customerName": "Test Customer",
  "waiter": null,
  "guestCount": null,
  "total": 21,
  "createdAt": "2026-01-19T09:17:58.061Z",
  "updatedAt": "2026-01-19T09:17:58.061Z",
  "orderItems": [
    {
      "id": 4,
      "orderId": 11001,
      "menuItemId": 3,
      "quantity": 1,
      "price": 5,
      "notes": "Extra mint",
      "prepArea": "BAR",
      "status": "PENDING",
      "createdAt": "2026-01-19T09:17:58.061Z",
      "updatedAt": "2026-01-19T09:17:58.061Z",
      "kitchenOrderId": null,
      "barOrderId": null
    },
    {
      "id": 5,
      "orderId": 11001,
      "menuItemId": 1,
      "quantity": 2,
      "price": 8,
      "notes": "Well done",
      "prepArea": "KITCHEN",
      "status": "PENDING",
      "createdAt": "2026-01-19T09:17:58.061Z",
      "updatedAt": "2026-01-19T09:17:58.061Z",
      "kitchenOrderId": null,
      "barOrderId": null
    }
  ],
  "kitchenOrder": {
    "id": 11001,
    "orderId": 11001,
    "status": "PENDING",
    "createdAt": "2026-01-19T09:17:58.061Z",
    "updatedAt": "2026-01-19T09:17:58.061Z"
  },
  "barOrder": {
    "id": 11001,
    "orderId": 11001,
    "status": "PENDING",
    "createdAt": "2026-01-19T09:17:58.061Z",
    "updatedAt": "2026-01-19T09:17:58.061Z"
  }
}
```

**All Kitchen Orders Response:**
```json
[
  {
    "id": 11000,
    "orderId": 11000,
    "status": "PENDING",
    "createdAt": "2026-01-14T12:22:42.766Z",
    "updatedAt": "2026-01-14T12:22:42.766Z",
    "items": [
      {
        "id": 1,
        "orderId": 11000,
        "menuItemId": 1,
        "quantity": 1,
        "price": 8,
        "notes": "No onions",
        "prepArea": "KITCHEN",
        "status": "PENDING",
        "createdAt": "2026-01-14T12:22:40.820Z",
        "updatedAt": "2026-01-14T12:22:42.766Z",
        "kitchenOrderId": 11000,
        "barOrderId": null
      }
    ]
  }
]
```

**All Bar Orders Response:**
```json
[
  {
    "id": 11000,
    "orderId": 11000,
    "status": "PENDING",
    "createdAt": "2026-01-14T12:22:43.943Z",
    "updatedAt": "2026-01-14T12:22:43.943Z",
    "items": [
      {
        "id": 3,
        "orderId": 11000,
        "menuItemId": 3,
        "quantity": 1,
        "price": 5,
        "notes": "Less sugar",
        "prepArea": "BAR",
        "status": "PENDING",
        "createdAt": "2026-01-14T12:22:40.820Z",
        "updatedAt": "2026-01-14T12:22:43.943Z",
        "kitchenOrderId": null,
        "barOrderId": 11000
      }
    ]
  }
]
```

**Kitchen Order Response:**
```json
{
  "id": 11001,
  "orderId": 11001,
  "status": "PREPARING",
  "createdAt": "2026-01-19T09:17:58.061Z",
  "updatedAt": "2026-01-19T09:22:14.979Z",
  "items": []
}
```

## Fixes Applied:

1. **Route Ordering Fix**: Moved `/kitchen-orders` and `/bar-orders` routes before the generic `/:id` routes in `order.routes.ts`
2. **Validation Schema Fix**: Updated validation schemas to remove nested `body` object structure

## Recommendations:

1. **Handle DELETE Constraints**: Implement cascade delete or add validation to prevent deletion of orders with items
2. **Add Error Handling**: Improve error messages for route conflicts and constraint violations
3. **Add Authentication**: Secure endpoints with proper authentication and authorization