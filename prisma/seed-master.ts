import { prisma } from "../lib/prisma";
import { PrepArea, OrderStatus, OrderItemStatus } from "../generated/prisma/client";
import bcrypt from "bcrypt";

async function main() {
  console.log('========================================');
  console.log('Starting Master Seed...');
  console.log('========================================\n');

  // =====================
  // 1. SEED PERMISSIONS
  // =====================
  console.log('1. Seeding permissions...');
  
  await prisma.permission.deleteMany();
  
  await prisma.permission.createMany({
    data: [
      // Orders permissions - Full rewrite for granular control
      { name: 'orders.create_new', description: 'Create new orders', category: 'orders' },
      { name: 'orders.view_current', description: 'View current orders', category: 'orders' },
      { name: 'orders.cancel', description: 'Cancel orders', category: 'orders' },
      { name: 'orders.make_payments', description: 'Make order payments', category: 'orders' },
      { name: 'orders.view_history', description: 'View order history', category: 'orders' },
      { name: 'orders.edit', description: 'Edit existing orders', category: 'orders' },
      
      // Menu permissions (view only)
      { name: 'menu.view', description: 'View menu items', category: 'menu' },

      // Kitchen menu permissions
      { name: 'kitchen.view_menu', description: 'View kitchen menu items', category: 'kitchen' },
      { name: 'kitchen.menu_create', description: 'Create kitchen menu items', category: 'kitchen' },
      { name: 'kitchen.menu_edit', description: 'Edit kitchen menu items', category: 'kitchen' },
      { name: 'kitchen.menu_delete', description: 'Delete kitchen menu items', category: 'kitchen' },

      // Kitchen permissions (for sidebar)
      { name: 'kitchen.manage_orders', description: 'Manage kitchen orders', category: 'kitchen' },
      { name: 'kitchen.view_inventory', description: 'View kitchen inventory', category: 'kitchen' },
      { name: 'kitchen.stock_requests', description: 'Manage stock requests', category: 'kitchen' },
      { name: 'kitchen.view_expiring', description: 'View expiring items', category: 'kitchen' },
      { name: 'kitchen.order_issues', description: 'Manage order issues', category: 'kitchen' },

      // Bar menu permissions
      { name: 'bar.view_menu', description: 'View bar menu items', category: 'bar' },
      { name: 'bar.menu_create', description: 'Create bar menu items', category: 'bar' },
      { name: 'bar.menu_edit', description: 'Edit bar menu items', category: 'bar' },
      { name: 'bar.menu_delete', description: 'Delete bar menu items', category: 'bar' },

      // Bar permissions (for sidebar)
      { name: 'bar.manage_orders', description: 'Manage bar orders', category: 'bar' },
      { name: 'bar.view_inventory', description: 'View bar inventory', category: 'bar' },
      { name: 'bar.stock_requests', description: 'Manage stock requests', category: 'bar' },
      { name: 'bar.order_issues', description: 'Manage order issues', category: 'bar' },

      // Inventory permissions - Full rewrite for granular control
      { name: 'inventory.view_current_stock', description: 'View current stock', category: 'inventory' },
      { name: 'inventory.add_items', description: 'Add inventory items', category: 'inventory' },
      { name: 'inventory.edit_items', description: 'Edit inventory items', category: 'inventory' },
      { name: 'inventory.delete_items', description: 'Delete inventory items', category: 'inventory' },
      { name: 'inventory.view_adjustments', description: 'View stock adjustments', category: 'inventory' },
      { name: 'inventory.create_adjustments', description: 'Create stock adjustments', category: 'inventory' },
      { name: 'inventory.view_requests', description: 'View stock requests', category: 'inventory' },
      { name: 'inventory.approve_requests', description: 'Approve or reject stock requests', category: 'inventory' },
      { name: 'inventory.view_expiring', description: 'View expiring items', category: 'inventory' },
      { name: 'inventory.update_expiring', description: 'Update expiring items', category: 'inventory' },

      // Purchases permissions - Full rewrite for granular control
      { name: 'purchases.view_orders', description: 'View purchase orders', category: 'purchases' },
      { name: 'purchases.create_orders', description: 'Create purchase orders', category: 'purchases' },
      { name: 'purchases.approve_orders', description: 'Approve or reject purchase orders', category: 'purchases' },
      { name: 'purchases.receive_goods', description: 'Receive goods', category: 'purchases' },
      { name: 'purchases.view_received', description: 'View goods received', category: 'purchases' },

      // Suppliers permissions (under purchases scope)
      { name: 'purchases.view_suppliers', description: 'View suppliers', category: 'purchases' },
      { name: 'purchases.add_suppliers', description: 'Add suppliers', category: 'purchases' },
      { name: 'purchases.edit_suppliers', description: 'Edit suppliers', category: 'purchases' },
      { name: 'purchases.delete_suppliers', description: 'Delete suppliers', category: 'purchases' },

      // Staff permissions
      { name: 'staff.view', description: 'View staff', category: 'staff' },
      { name: 'staff.create', description: 'Create staff records', category: 'staff' },
      { name: 'staff.edit', description: 'Edit staff records', category: 'staff' },
      { name: 'staff.delete', description: 'Delete staff records', category: 'staff' },

      // Users permissions
      { name: 'users.view', description: 'View users', category: 'users' },
      { name: 'users.create', description: 'Create users', category: 'users' },
      { name: 'users.edit', description: 'Edit users', category: 'users' },
      { name: 'users.delete', description: 'Delete users', category: 'users' },
      { name: 'users.manage_permissions', description: 'Manage user permissions', category: 'users' },

      // User Groups permissions
      { name: 'user_groups.view', description: 'View user groups', category: 'users' },
      { name: 'user_groups.create', description: 'Create user groups', category: 'users' },
      { name: 'user_groups.edit', description: 'Edit user groups', category: 'users' },
      { name: 'user_groups.delete', description: 'Delete user groups', category: 'users' },

      // Departments & Roles permissions
      { name: 'departments.view', description: 'View departments', category: 'staff' },
      { name: 'departments.manage', description: 'Manage departments', category: 'staff' },
      { name: 'roles.view', description: 'View staff roles', category: 'staff' },
      { name: 'roles.manage', description: 'Manage staff roles', category: 'staff' },

      // Reports permissions
      { name: 'reports.view', description: 'View reports', category: 'reports' },
      { name: 'reports.export', description: 'Export reports', category: 'reports' },

      // Settings permissions
      { name: 'settings.view_alerts', description: 'View alerts', category: 'settings' },
      { name: 'settings.edit_alerts', description: 'Edit alerts', category: 'settings' },
      { name: 'settings.view_business_information', description: 'View business information', category: 'settings' },
      { name: 'settings.edit_business_information', description: 'Edit business information', category: 'settings' },
      { name: 'settings.view_configurations', description: 'View configurations', category: 'settings' },
      { name: 'settings.edit_configurations', description: 'Edit configurations', category: 'settings' },

      // Tables permissions
      { name: 'tables.view', description: 'View tables', category: 'reservations' },
      { name: 'tables.manage', description: 'Manage tables', category: 'reservations' },

      // Reservations permissions
      { name: 'reservations.view', description: 'View reservations', category: 'reservations' },
      { name: 'reservations.create', description: 'Create reservations', category: 'reservations' },
      { name: 'reservations.edit', description: 'Edit reservations', category: 'reservations' },
      { name: 'reservations.cancel', description: 'Cancel reservations', category: 'reservations' },

      // Accounting permissions - Full CRUD for expenses
      { name: 'accounting.view', description: 'View accounting', category: 'accounting' },
      { name: 'accounting.create_expenses', description: 'Create expenses', category: 'accounting' },
      { name: 'accounting.edit_expenses', description: 'Edit expenses', category: 'accounting' },
      { name: 'accounting.delete_expenses', description: 'Delete expenses', category: 'accounting' },

      // Payment permissions
      { name: 'payments.view', description: 'View payments', category: 'orders' },
      { name: 'payments.create', description: 'Create/process payments', category: 'orders' },
      { name: 'payments.refund', description: 'Refund payments', category: 'orders' },
    ],
    skipDuplicates: true,
  });
  console.log('   ✓ Permissions seeded\n');

  // =====================
  // 2. SEED USER GROUPS
  // =====================
  console.log('2. Seeding user groups...');

  const allPermissions = await prisma.permission.findMany();
  const allPermissionIds = allPermissions.map(p => ({ permissionId: p.id }));

  // Create Admin group with ALL permissions
  const adminGroup = await prisma.userGroup.upsert({
    where: { name: 'Admin' },
    update: {
      description: 'Full system access',
      isDefault: false,
      isActive: true,
    },
    create: {
      name: 'Admin',
      description: 'Full system access',
      isDefault: false,
      isActive: true,
    },
  });
  
  // Clear and add all permissions to Admin
  await prisma.userGroupPermission.deleteMany({ where: { userGroupId: adminGroup.id } });
  await prisma.userGroupPermission.createMany({
    data: allPermissionIds.map(p => ({ ...p, userGroupId: adminGroup.id }))
  });

  // Create Manager group - specific permissions
  const managerPermissions = [
    'orders.create_new', 'orders.view_current', 'orders.view_history', 'orders.edit', 'orders.cancel', 'orders.make_payments',
    'menu.view',
    'inventory.view_current_stock', 'inventory.add_items', 'inventory.edit_items', 'inventory.view_adjustments', 'inventory.create_adjustments',
    'inventory.view_requests', 'inventory.approve_requests', 'inventory.view_expiring', 'inventory.update_expiring',
    'purchases.view_orders', 'purchases.create_orders', 'purchases.approve_orders', 'purchases.receive_goods', 'purchases.view_received',
    'purchases.view_suppliers', 'purchases.add_suppliers', 'purchases.edit_suppliers', 'purchases.delete_suppliers',
    'goods_receiving.view', 'goods_receiving.create', 'goods_receiving.edit',
    'staff.view', 'staff.create', 'staff.edit',
    'users.view', 'users.create', 'users.edit',
    'reports.view', 'reports.export',
    'settings.view_alerts', 'settings.edit_alerts',
    'settings.view_business_information', 'settings.edit_business_information',
    'settings.view_configurations', 'settings.edit_configurations',
    'tables.view', 'tables.manage',
    'reservations.view', 'reservations.create', 'reservations.edit',
    'accounting.view', 'accounting.create_expenses', 'accounting.edit_expenses', 'accounting.delete_expenses',
    'departments.view', 'roles.view'
  ];
  
  const managerPerms = await prisma.permission.findMany({
    where: { name: { in: managerPermissions } }
  });

  const managerGroup = await prisma.userGroup.upsert({
    where: { name: 'Manager' },
    update: {
      description: 'Management access - can manage day-to-day operations',
      isDefault: false,
      isActive: true,
    },
    create: {
      name: 'Manager',
      description: 'Management access - can manage day-to-day operations',
      isDefault: false,
      isActive: true,
    },
  });
  
  await prisma.userGroupPermission.deleteMany({ where: { userGroupId: managerGroup.id } });
  await prisma.userGroupPermission.createMany({
    data: managerPerms.map(p => ({ permissionId: p.id, userGroupId: managerGroup.id }))
  });

  // Create Waiter group
  const waiterPermissions = [
    'orders.create_new', 'orders.view_current', 'orders.make_payments',
    'menu.view',
    'inventory.view_current_stock',
    'tables.view',
    'reservations.view', 'reservations.create',
    'payments.view', 'payments.create'
  ];
  
  const waiterPerms = await prisma.permission.findMany({
    where: { name: { in: waiterPermissions } }
  });

  const waiterGroup = await prisma.userGroup.upsert({
    where: { name: 'Waiter' },
    update: {
      description: 'Front of house staff - can take orders and view menu',
      isDefault: true,
      isActive: true,
    },
    create: {
      name: 'Waiter',
      description: 'Front of house staff - can take orders and view menu',
      isDefault: true,
      isActive: true,
    },
  });
  
  await prisma.userGroupPermission.deleteMany({ where: { userGroupId: waiterGroup.id } });
  await prisma.userGroupPermission.createMany({
    data: waiterPerms.map(p => ({ permissionId: p.id, userGroupId: waiterGroup.id }))
  });

  // Create Bartender group
  const bartenderPermissions = [
    'orders.create_new', 'orders.view_current', 'orders.make_payments',
    'menu.view', 'bar.view_menu', 'bar.menu_create', 'bar.menu_edit', 'bar.menu_delete',
    'bar.manage_orders', 'bar.view_inventory', 'bar.stock_requests', 'bar.order_issues',
    'inventory.view_current_stock',
    'payments.view', 'payments.create'
  ];
  
  const bartenderPerms = await prisma.permission.findMany({
    where: { name: { in: bartenderPermissions } }
  });

  const bartenderGroup = await prisma.userGroup.upsert({
    where: { name: 'Bartender' },
    update: {
      description: 'Bar staff - can view bar orders and menu',
      isDefault: false,
      isActive: true,
    },
    create: {
      name: 'Bartender',
      description: 'Bar staff - can view bar orders and menu',
      isDefault: false,
      isActive: true,
    },
  });
  
  await prisma.userGroupPermission.deleteMany({ where: { userGroupId: bartenderGroup.id } });
  await prisma.userGroupPermission.createMany({
    data: bartenderPerms.map(p => ({ permissionId: p.id, userGroupId: bartenderGroup.id }))
  });

  // Create Kitchen group
  const kitchenPermissions = [
    'orders.view_current',
    'menu.view', 'kitchen.view_menu', 'kitchen.menu_create', 'kitchen.menu_edit', 'kitchen.menu_delete',
    'kitchen.manage_orders', 'kitchen.view_inventory', 'kitchen.stock_requests', 'kitchen.view_expiring', 'kitchen.order_issues',
    'inventory.view_current_stock', 'inventory.create_adjustments', 'inventory.view_adjustments',
    'inventory.view_requests', 'inventory.view_expiring'
  ];
  
  const kitchenPerms = await prisma.permission.findMany({
    where: { name: { in: kitchenPermissions } }
  });

  const kitchenGroup = await prisma.userGroup.upsert({
    where: { name: 'Kitchen' },
    update: {
      description: 'Kitchen staff - can view kitchen orders and inventory',
      isDefault: false,
      isActive: true,
    },
    create: {
      name: 'Kitchen',
      description: 'Kitchen staff - can view kitchen orders and inventory',
      isDefault: false,
      isActive: true,
    },
  });
  
  await prisma.userGroupPermission.deleteMany({ where: { userGroupId: kitchenGroup.id } });
  await prisma.userGroupPermission.createMany({
    data: kitchenPerms.map(p => ({ permissionId: p.id, userGroupId: kitchenGroup.id }))
  });

  console.log('   ✓ User groups seeded with permissions\n');

  // =====================
  // 3. SEED DEPARTMENTS
  // =====================
  console.log('3. Seeding departments...');

  await prisma.department.createMany({
    data: [
      { name: 'Bar', description: 'Bar and beverage service department' },
      { name: 'Kitchen', description: 'Kitchen and food preparation department' },
      { name: 'Operations', description: 'General operations and logistics' },
      { name: 'Front House', description: 'Front of house - host, servers, and customer service' },
      { name: 'Management', description: 'Management and administrative staff' },
    ],
    skipDuplicates: true,
  });

  // Get department IDs
  const barDept = await prisma.department.findUnique({ where: { name: 'Bar' } });
  const kitchenDept = await prisma.department.findUnique({ where: { name: 'Kitchen' } });
  const operationsDept = await prisma.department.findUnique({ where: { name: 'Operations' } });
  const frontHouseDept = await prisma.department.findUnique({ where: { name: 'Front House' } });
  const managementDept = await prisma.department.findUnique({ where: { name: 'Management' } });

  console.log('   ✓ Departments seeded\n');

  // =====================
  // 4. SEED STAFF ROLES
  // =====================
  console.log('4. Seeding staff roles...');

  await prisma.staffRole.createMany({
    data: [
      { name: 'System Admin', description: 'System administrator with full technical access', departmentId: managementDept?.id },
      { name: 'Manager', description: 'Restaurant manager overseeing all operations', departmentId: managementDept?.id },
      { name: 'Waiter', description: 'Front of house server', departmentId: frontHouseDept?.id },
      { name: 'Bartender', description: 'Bar staff preparing and serving drinks', departmentId: barDept?.id },
      { name: 'Chef', description: 'Kitchen chef preparing food', departmentId: kitchenDept?.id },
      { name: 'Sous Chef', description: 'Assistant kitchen chef', departmentId: kitchenDept?.id },
      { name: 'Line Cook', description: 'Kitchen line cook', departmentId: kitchenDept?.id },
      { name: 'Dishwasher', description: 'Kitchen dishwashing staff', departmentId: kitchenDept?.id },
      { name: 'Host', description: 'Front of house host greeting customers', departmentId: frontHouseDept?.id },
      { name: 'Barista', description: 'Coffee and beverage specialist', departmentId: barDept?.id },
      { name: 'Cashier', description: 'Point of sale and payment processing', departmentId: frontHouseDept?.id },
      { name: 'Storekeeper', description: 'Inventory and storage management', departmentId: operationsDept?.id },
    ],
    skipDuplicates: true,
  });

  // Get staff role IDs
  const adminRole = await prisma.staffRole.findUnique({ where: { name: 'System Admin' } });
  const managerRole = await prisma.staffRole.findUnique({ where: { name: 'Manager' } });
  const waiterRole = await prisma.staffRole.findUnique({ where: { name: 'Waiter' } });
  const bartenderRole = await prisma.staffRole.findUnique({ where: { name: 'Bartender' } });
  const chefRole = await prisma.staffRole.findUnique({ where: { name: 'Chef' } });

  console.log('   ✓ Staff roles seeded\n');

  // =====================
  // 5. CREATE STAFF MEMBERS
  // =====================
  console.log('5. Creating staff members...');

  // Create Admin Staff
  const adminStaff = await prisma.staff.upsert({
    where: { email: 'admin@apotek.com' },
    update: {
      firstName: 'Admin',
      lastName: 'User',
      phone: '+255123456789',
      roleId: adminRole?.id,
      departmentId: managementDept?.id,
      status: 'ACTIVE',
    },
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@apotek.com',
      phone: '+255123456789',
      roleId: adminRole?.id,
      departmentId: managementDept?.id,
      status: 'ACTIVE',
    },
  });


  console.log('   ✓ Staff members created\n');

  // =====================
  // 6. CREATE USER ACCOUNTS
  // =====================
  console.log('6. Creating user accounts with hashed passwords...');

  // Hash passwords using bcrypt (same as login service)
  const saltRounds = 10;
  const hashedAdminPassword = await bcrypt.hash('admin123', saltRounds);


  // Create Admin User (linked to admin staff)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      email: 'admin@apotek.com',
      staffId: adminStaff.id,
      userGroupId: adminGroup.id,
      isActive: true,
    },
    create: {
      username: 'admin',
      email: 'admin@apotek.com',
      passwordHash: hashedAdminPassword,
      staffId: adminStaff.id,
      userGroupId: adminGroup.id,
      isActive: true,
    },
  });


  console.log('   ✓ User accounts created\n');

  // =====================
  // 7. SEED ADDITIONAL DATA
  // =====================
  console.log('7. Seeding additional data...');

  // Inventory Categories
  await prisma.inventoryCategory.createMany({
    data: [
      { name: 'Produce', description: 'Fresh fruits and vegetables' },
      { name: 'Dairy', description: 'Milk, cheese, and other dairy products' },
      { name: 'Meat', description: 'Beef, poultry, and pork' },
      { name: 'Seafood', description: 'Fresh and frozen seafood' },
      { name: 'Bakery', description: 'Breads, pastries, and other baked goods' },
      { name: 'Dry Goods', description: 'Flour, sugar, pasta, and other non-perishable items' },
      { name: 'Canned Goods', description: 'Canned fruits, vegetables, and other products' },
      { name: 'Frozen Goods', description: 'Frozen fruits, vegetables, and other products' },
      { name: 'Beverages', description: 'Sodas, juices, and other drinks' },
      { name: 'Alcohol', description: 'Beer, wine, and spirits' },
      { name: 'Cleaning Supplies', description: 'Soaps, detergents, and other cleaning products' },
      { name: 'Other', description: 'Miscellaneous items' },
    ],
    skipDuplicates: true,
  });

  // Inventory Units
  await prisma.inventoryUnit.createMany({
    data: [
      { name: 'Kilogram', type: 'Mass', symbol: 'kg' },
      { name: 'Gram', type: 'Mass', symbol: 'g' },
      { name: 'Liter', type: 'Volume', symbol: 'L' },
      { name: 'Milliliter', type: 'Volume', symbol: 'mL' },
      { name: 'Each', type: 'Count', symbol: 'ea' },
      { name: 'Dozen', type: 'Count', symbol: 'dz' },
      { name: 'Case', type: 'Count', symbol: 'case' },
      { name: 'Box', type: 'Count', symbol: 'box' },
      { name: 'Bag', type: 'Count', symbol: 'bag' },
      { name: 'Bottle', type: 'Count', symbol: 'bottle' },
      { name: 'Can', type: 'Count', symbol: 'can' },
      { name: 'Jar', type: 'Count', symbol: 'jar' },
      { name: 'Roll', type: 'Count', symbol: 'roll' },
    ],
    skipDuplicates: true,
  });

  // =====================
  // SUMMARY
  // =====================
  console.log('========================================');
  console.log('Master Seed Completed Successfully!');
  console.log('========================================\n');
  
  console.log('User Accounts Created (passwords are bcrypt hashed):');
  console.log('  - admin / admin123 (Admin - Full Access)');

}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });