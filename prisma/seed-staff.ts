import { prisma } from "../lib/prisma";

async function main() {
  console.log('Seeding departments and staff roles...');

  // Create Departments
  const departments = await prisma.department.createMany({
    data: [
      { name: 'Bar', description: 'Bar and beverage service department' },
      { name: 'Kitchen', description: 'Kitchen and food preparation department' },
      { name: 'Operations', description: 'General operations and logistics' },
      { name: 'Front House', description: 'Front of house - host, servers, and customer service' },
      { name: 'Management', description: 'Management and administrative staff' },
    ],
    skipDuplicates: true,
  });
  console.log('Created departments');

  // Get department IDs for linking staff roles
  const barDept = await prisma.department.findUnique({ where: { name: 'Bar' } });
  const kitchenDept = await prisma.department.findUnique({ where: { name: 'Kitchen' } });
  const operationsDept = await prisma.department.findUnique({ where: { name: 'Operations' } });
  const frontHouseDept = await prisma.department.findUnique({ where: { name: 'Front House' } });
  const managementDept = await prisma.department.findUnique({ where: { name: 'Management' } });

  // Create Staff Roles with department associations
  await prisma.staffRole.createMany({
    data: [
      { 
        name: 'System Admin', 
        description: 'System administrator with full technical access',
        departmentId: managementDept?.id 
      },
      { 
        name: 'Manager', 
        description: 'Restaurant manager overseeing all operations',
        departmentId: managementDept?.id 
      },
      { 
        name: 'Waiter', 
        description: 'Front of house server',
        departmentId: frontHouseDept?.id 
      },
      { 
        name: 'Bartender', 
        description: 'Bar staff preparing and serving drinks',
        departmentId: barDept?.id 
      },
      { 
        name: 'Chef', 
        description: 'Kitchen chef preparing food',
        departmentId: kitchenDept?.id 
      },
      { 
        name: 'Sous Chef', 
        description: 'Assistant kitchen chef',
        departmentId: kitchenDept?.id 
      },
      { 
        name: 'Line Cook', 
        description: 'Kitchen line cook',
        departmentId: kitchenDept?.id 
      },
      { 
        name: 'Dishwasher', 
        description: 'Kitchen dishwashing staff',
        departmentId: kitchenDept?.id 
      },
      { 
        name: 'Host', 
        description: 'Front of house host greeting customers',
        departmentId: frontHouseDept?.id 
      },
      { 
        name: 'Barista', 
        description: 'Coffee and beverage specialist',
        departmentId: barDept?.id 
      },
      { 
        name: 'Cashier', 
        description: 'Point of sale and payment processing',
        departmentId: frontHouseDept?.id 
      },
      { 
        name: 'Storekeeper', 
        description: 'Inventory and storage management',
        departmentId: operationsDept?.id 
      },
    ],
    skipDuplicates: true,
  });
  console.log('Created staff roles');

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