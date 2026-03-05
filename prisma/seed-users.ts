import { prisma } from "../lib/prisma";

async function main() {
  console.log('Seeding permissions and user groups...');

  // Delete Permissions
  await prisma.permission.deleteMany()
  // Create Permissions
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
      { name: 'kitchen.menu_create', description: 'Create kitchen menu items', category: 'kitchen' },
      { name: 'kitchen.menu_edit', description: 'Edit kitchen menu items', category: 'kitchen' },
      { name: 'kitchen.menu_delete', description: 'Delete kitchen menu items', category: 'kitchen' },

      // Kitchen permissions (for sidebar)
      { name: 'kitchen.manage_orders', description: 'Manage kitchen orders', category: 'kitchen' },
      { name: 'kitchen.view_inventory', description: 'View kitchen inventory', category: 'kitchen' },
      { name: 'kitchen.view_requests', description: 'View stock requests', category: 'kitchen' },
      { name: 'kitchen.view_expiring', description: 'View expiring items', category: 'kitchen' },
      { name: 'kitchen.dissatisfactions', description: 'View dissatisfactions', category: 'kitchen' },

      // Bar menu permissions
      { name: 'bar.menu_create', description: 'Create bar menu items', category: 'bar' },
      { name: 'bar.menu_edit', description: 'Edit bar menu items', category: 'bar' },
      { name: 'bar.menu_delete', description: 'Delete bar menu items', category: 'bar' },

      // Bar permissions (for sidebar)
      { name: 'bar.manage_orders', description: 'Manage bar orders', category: 'bar' },
      { name: 'bar.view_inventory', description: 'View bar inventory', category: 'bar' },
      { name: 'bar.returns', description: 'View bar returns', category: 'bar' },

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
      
      // Settings sub-menus permissions
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
  console.log('Created permissions');

  // Get all permissions for Admin group
  const allPermissions = await prisma.permission.findMany();
  const allPermissionIds = allPermissions.map(p => ({ permissionId: p.id }));

  // Create or update Admin group - gets ALL permissions
  await prisma.userGroup.upsert({
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
      permissions: {
        create: allPermissionIds,
      },
    },
  });

  // Get Admin group and update its permissions
  const adminGroup = await prisma.userGroup.findUnique({ where: { name: 'Admin' } });
  if (adminGroup) {
    // Remove old permissions and add new ones
    await prisma.userGroupPermission.deleteMany({ where: { userGroupId: adminGroup.id } });
    await prisma.userGroupPermission.createMany({
      data: allPermissionIds.map(p => ({ ...p, userGroupId: adminGroup.id }))
    });
  }

  // Create Manager group - specific permissions
  const managerPermissions = [
    'orders.create_new', 'orders.view_current', 'orders.view_history', 'orders.edit', 'orders.cancel', 'orders.make_payments',
    'menu.view',
    'inventory.view_current_stock', 'inventory.add_items', 'inventory.edit_items', 'inventory.view_adjustments', 'inventory.create_adjustments',
    'inventory.view_requests', 'inventory.approve_requests', 'inventory.view_expiring',
    'purchases.view_orders', 'purchases.create_orders', 'purchases.approve_orders', 'purchases.receive_goods', 'purchases.view_received',
    'purchases.view_suppliers', 'purchases.add_suppliers', 'purchases.edit_suppliers', 'purchases.delete_suppliers',
    'goods_receiving.view', 'goods_receiving.create', 'goods_receiving.edit',
    'staff.view', 'staff.create', 'staff.edit',
    'users.view', 'users.create', 'users.edit',
    'reports.view', 'reports.export',
    'settings.view',
    'tables.view', 'tables.manage',
    'reservations.view', 'reservations.create', 'reservations.edit',
    'accounting.view', 'accounting.create_expenses', 'accounting.edit_expenses', 'accounting.delete_expenses',
    'departments.view', 'roles.view'
  ];
  
  const managerPerms = await prisma.permission.findMany({
    where: { name: { in: managerPermissions } }
  });

  await prisma.userGroup.upsert({
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
      permissions: {
        create: managerPerms.map(p => ({ permissionId: p.id })),
      },
    },
  });

  // Update Manager group permissions
  const managerGroup = await prisma.userGroup.findUnique({ where: { name: 'Manager' } });
  if (managerGroup) {
    await prisma.userGroupPermission.deleteMany({ where: { userGroupId: managerGroup.id } });
    await prisma.userGroupPermission.createMany({
      data: managerPerms.map(p => ({ permissionId: p.id, userGroupId: managerGroup.id }))
    });
  }

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

  await prisma.userGroup.upsert({
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
      permissions: {
        create: waiterPerms.map(p => ({ permissionId: p.id })),
      },
    },
  });

  // Update Waiter group permissions
  const waiterGroup = await prisma.userGroup.findUnique({ where: { name: 'Waiter' } });
  if (waiterGroup) {
    await prisma.userGroupPermission.deleteMany({ where: { userGroupId: waiterGroup.id } });
    await prisma.userGroupPermission.createMany({
      data: waiterPerms.map(p => ({ permissionId: p.id, userGroupId: waiterGroup.id }))
    });
  }

  // Create Bartender group
  const bartenderPermissions = [
    'orders.create_new', 'orders.view_current', 'orders.make_payments',
    'menu.view', 'bar.menu_create', 'bar.menu_edit', 'bar.menu_delete',
    'bar.manage_orders', 'bar.view_inventory', 'bar.returns',
    'inventory.view_current_stock',
    'payments.view', 'payments.create'
  ];
  
  const bartenderPerms = await prisma.permission.findMany({
    where: { name: { in: bartenderPermissions } }
  });

  await prisma.userGroup.upsert({
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
      permissions: {
        create: bartenderPerms.map(p => ({ permissionId: p.id })),
      },
    },
  });

  // Update Bartender group permissions
  const bartenderGroup = await prisma.userGroup.findUnique({ where: { name: 'Bartender' } });
  if (bartenderGroup) {
    await prisma.userGroupPermission.deleteMany({ where: { userGroupId: bartenderGroup.id } });
    await prisma.userGroupPermission.createMany({
      data: bartenderPerms.map(p => ({ permissionId: p.id, userGroupId: bartenderGroup.id }))
    });
  }

  // Create Kitchen group
  const kitchenPermissions = [
    'orders.view_current',
    'menu.view', 'kitchen.menu_create', 'kitchen.menu_edit', 'kitchen.menu_delete',
    'kitchen.manage_orders', 'kitchen.view_inventory', 'kitchen.view_requests', 'kitchen.view_expiring', 'kitchen.dissatisfactions',
    'inventory.view_current_stock', 'inventory.create_adjustments', 'inventory.view_adjustments',
    'inventory.view_requests', 'inventory.view_expiring'
  ];
  
  const kitchenPerms = await prisma.permission.findMany({
    where: { name: { in: kitchenPermissions } }
  });

  await prisma.userGroup.upsert({
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
      permissions: {
        create: kitchenPerms.map(p => ({ permissionId: p.id })),
      },
    },
  });

  // Update Kitchen group permissions
  const kitchenGroup = await prisma.userGroup.findUnique({ where: { name: 'Kitchen' } });
  if (kitchenGroup) {
    await prisma.userGroupPermission.deleteMany({ where: { userGroupId: kitchenGroup.id } });
    await prisma.userGroupPermission.createMany({
      data: kitchenPerms.map(p => ({ permissionId: p.id, userGroupId: kitchenGroup.id }))
    });
  }

  console.log('Created user groups');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });