import { prisma } from "../lib/prisma";

async function main() {
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

  await prisma.inventoryUnit.createMany({
    data: [
        { name: 'Kilogram', type: 'Mass', symbol: 'kg' },
        { name: 'Gram', type: 'Mass', symbol: 'g' },
        { name: 'Liter', type: 'Volume', symbol: 'L' },
        { name: 'Milliliter', type: 'Volume', symbol: 'mL' },
        { name: 'Gallon', type: 'Volume', symbol: 'gal' },
        { name: 'Pint', type: 'Volume', symbol: 'pt' },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
