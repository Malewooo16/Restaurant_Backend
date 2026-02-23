import { prisma } from "../lib/prisma";

async function main() {
  console.log('Seeding permissions and user groups...');

  // Delete Permissions
  await prisma.permission.deleteMany()
  // Create Permissions
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
    'orders.view', 'orders.create',
    'menu.view',
    'inventory.view',
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
    'orders.view',
    'menu.view',
    'inventory.view', 'inventory.adjust'
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