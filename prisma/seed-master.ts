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
      // Orders permissions
      { name: 'orders.view', description: 'View orders', category: 'orders' },
      { name: 'orders.create', description: 'Create new orders', category: 'orders' },
      { name: 'orders.edit', description: 'Edit existing orders', category: 'orders' },
      { name: 'orders.cancel', description: 'Cancel orders', category: 'orders' },
      
      // Menu permissions
      { name: 'menu.view', description: 'View menu items', category: 'menu' },
      { name: 'menu.create', description: 'Create menu items', category: 'menu' },
      { name: 'menu.edit', description: 'Edit menu items', category: 'menu' },
      { name: 'menu.delete', description: 'Delete menu items', category: 'menu' },

      // Inventory permissions
      { name: 'inventory.view', description: 'View inventory', category: 'inventory' },
      { name: 'inventory.create', description: 'Add inventory items', category: 'inventory' },
      { name: 'inventory.edit', description: 'Edit inventory items', category: 'inventory' },
      { name: 'inventory.delete', description: 'Delete inventory items', category: 'inventory' },
      { name: 'inventory.adjust', description: 'Adjust inventory quantities', category: 'inventory' },
      { name: 'inventory.transfer', description: 'Transfer inventory between departments', category: 'inventory' },

      // Purchases permissions
      { name: 'purchases.view', description: 'View purchase orders', category: 'purchases' },
      { name: 'purchases.create', description: 'Create purchase orders', category: 'purchases' },
      { name: 'purchases.approve', description: 'Approve purchase orders', category: 'purchases' },
      { name: 'purchases.receive', description: 'Receive goods', category: 'purchases' },

      // Suppliers permissions
      { name: 'suppliers.view', description: 'View suppliers', category: 'purchases' },
      { name: 'suppliers.create', description: 'Create suppliers', category: 'purchases' },
      { name: 'suppliers.edit', description: 'Edit suppliers', category: 'purchases' },
      { name: 'suppliers.delete', description: 'Delete suppliers', category: 'purchases' },

      // Goods Receiving permissions
      { name: 'goods_receiving.view', description: 'View goods receiving records', category: 'purchases' },
      { name: 'goods_receiving.create', description: 'Create goods receiving records', category: 'purchases' },
      { name: 'goods_receiving.edit', description: 'Edit goods receiving records', category: 'purchases' },
      { name: 'goods_receiving.delete', description: 'Delete goods receiving records', category: 'purchases' },

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
      { name: 'settings.view', description: 'View settings', category: 'settings' },
      { name: 'settings.manage', description: 'Manage settings', category: 'settings' },
      { name: 'settings.restaurant_info', description: 'View and edit restaurant info', category: 'settings' },
      { name: 'settings.configurations', description: 'Manage configurations', category: 'settings' },
      { name: 'settings.tables', description: 'Manage tables', category: 'settings' },
      { name: 'settings.departments', description: 'Manage departments', category: 'settings' },
      { name: 'settings.staff_roles', description: 'Manage staff roles', category: 'settings' },
      { name: 'settings.inventory_categories', description: 'Manage inventory categories', category: 'settings' },
      { name: 'settings.menu_categories', description: 'Manage menu categories', category: 'settings' },
      { name: 'settings.adjustment_reasons', description: 'Manage adjustment reasons', category: 'settings' },
      { name: 'settings.expense_categories', description: 'Manage expense categories', category: 'settings' },
      { name: 'settings.units', description: 'Manage units', category: 'settings' },
      { name: 'settings.alerts', description: 'Manage alerts', category: 'settings' },

      // Tables permissions
      { name: 'tables.view', description: 'View tables', category: 'reservations' },
      { name: 'tables.manage', description: 'Manage tables', category: 'reservations' },

      // Reservations permissions
      { name: 'reservations.view', description: 'View reservations', category: 'reservations' },
      { name: 'reservations.create', description: 'Create reservations', category: 'reservations' },
      { name: 'reservations.edit', description: 'Edit reservations', category: 'reservations' },
      { name: 'reservations.cancel', description: 'Cancel reservations', category: 'reservations' },

      // Accounting permissions
      { name: 'accounting.view', description: 'View accounting', category: 'accounting' },
      { name: 'accounting.expenses', description: 'Manage expenses', category: 'accounting' },

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
    'orders.view', 'orders.create', 'orders.edit', 'orders.cancel',
    'menu.view', 'menu.create', 'menu.edit',
    'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.adjust',
    'purchases.view', 'purchases.create', 'purchases.approve', 'purchases.receive',
    'suppliers.view', 'suppliers.create', 'suppliers.edit',
    'goods_receiving.view', 'goods_receiving.create', 'goods_receiving.edit',
    'staff.view', 'staff.create', 'staff.edit',
    'users.view', 'users.create', 'users.edit',
    'reports.view', 'reports.export',
    'settings.view',
    'tables.view', 'tables.manage',
    'reservations.view', 'reservations.create', 'reservations.edit',
    'accounting.view', 'accounting.expenses',
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
    'orders.view', 'orders.create',
    'menu.view',
    'inventory.view',
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
    'orders.view', 'orders.create',
    'menu.view',
    'inventory.view',
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
    'orders.view',
    'menu.view',
    'inventory.view', 'inventory.adjust'
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