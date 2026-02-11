import { Departments } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';


// Function to get inventory items for a specific department
export const getDepartmentInventoryItems = async (department: Departments) => {
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: {
      // Filter InventoryItems that are explicitly marked as usable by the requested department
      department: { has: department },
      name:{
        mode: 'insensitive'
      }
    },
    include: {
      category: {
        select: {
          name: true, // Select only category name
        },
      },
      departmentInventories: {
        where: {
          department: department, // Filter for the specific department's inventory
        },
        select: {
          quantity: true,
          id: true, // Include departmentInventoryId
        },
      },
    },
    orderBy:{
      name: 'asc' // Order by item name alphabetically
    }
  });

  // Map and transform the data to the desired output format
  return inventoryItems.map((item) => {
    const departmentalEntry = item.departmentInventories[0]; // Will be undefined if no entry exists

    return {
      id: item.id, // InventoryItem ID
      name: item.name, // InventoryItem name
      categoryName: item.category?.name,
      currentStock: departmentalEntry?.quantity ?? 0, // Quantity from DepartmentInventory, or 0 if not found
      departmentInventoryId: departmentalEntry?.id ?? null, // DepartmentInventory ID, or null if not found
      unit: item.unit,
      department: department, // The department being queried
    };
  });
};

// Function to update an existing department inventory quantity
export const updateDepartmentInventoryQuantity = async (
  departmentInventoryId: number,
  newQuantity: number
) => {
  return prisma.$transaction(async (tx) => {
    // 1. Find the existing DepartmentInventory record
    const existingDepartmentInventory = await tx.departmentInventory.findUnique({
      where: {
        id: departmentInventoryId,
      },
      include: {
        inventoryItem: {
          select: {
            id: true,
            quantity: true, // Get main inventory quantity
          },
        },
      },
    });

    if (!existingDepartmentInventory) {
      throw new Error(`DepartmentInventory with ID ${departmentInventoryId} not found.`);
    }

    const oldQuantity = existingDepartmentInventory.quantity;
    const changeInQuantity = newQuantity - oldQuantity;

    // 2. Update the DepartmentInventory record
    const updatedDepartmentInventory = await tx.departmentInventory.update({
      where: { id: departmentInventoryId },
      data: {
        quantity: newQuantity,
      },
    });

    
    // 4. Record an InventoryTransaction
    await tx.inventoryTransaction.create({
      data: {
        itemId: existingDepartmentInventory.inventoryItem.id,
        quantity: Math.abs(changeInQuantity), // Absolute value of change
        transactionType: 'TRANSFER', // Reflects transfer from/to main stock
        reference: `Departmental stock update for ${existingDepartmentInventory.department}`,
        notes: `Adjusted departmental stock for ${existingDepartmentInventory.department} (ID: ${departmentInventoryId}) from ${oldQuantity} to ${newQuantity}. Main stock adjusted by ${-changeInQuantity}.`,
      },
    });

    return updatedDepartmentInventory;
  });
};