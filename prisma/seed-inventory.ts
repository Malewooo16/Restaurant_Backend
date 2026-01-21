import { prisma } from "../lib/prisma";
import { PrepArea } from "../generated/prisma/client";

async function main() {
  console.log('Seeding inventory categories, units, menu addons, side dishes, and categories...');
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

  await prisma.menuAddon.createMany({
    data: [
      { name: 'Extra Cheese', price: 1.50, isAvailable: true },
      { name: 'Bacon Strips', price: 2.00, isAvailable: true },
      { name: 'Avocado Slice', price: 2.50, isAvailable: true },
      { name: 'Jalapenos', price: 0.75, isAvailable: true },
      { name: 'Mushrooms', price: 1.00, isAvailable: true },
    ],
    skipDuplicates: true,
  });

  await prisma.menuSideDish.createMany({
    data: [
      { name: 'French Fries', price: 3.00, isAvailable: true },
      { name: 'Side Salad', price: 3.50, isAvailable: true },
      { name: 'Onion Rings', price: 4.00, isAvailable: true },
      { name: 'Sweet Potato Fries', price: 4.50, isAvailable: true },
      { name: 'Mashed Potatoes', price: 3.75, isAvailable: true },
      { name: 'Coleslaw', price: 2.50, isAvailable: true },
    ],
    skipDuplicates: true,
  });

  await prisma.menuCategory.createMany({
    data: [
      { name: 'Appetizers', description: 'Starters to whet your appetite', isActive: true },
      { name: 'Main Courses', description: 'Our main dishes', isActive: true },
      { name: 'Desserts', description: 'Sweet treats', isActive: true },
      { name: 'Beverages', description: 'Drinks of all kinds', isActive: true },
      { name: 'Specials', description: 'Chef\'s recommendations', isActive: true },
    ],
    skipDuplicates: true,
  });


  // Get the created categories to use for menu items
  const appetizers = await prisma.menuCategory.findFirst({
    where: { name: 'Appetizers' },
  });

  const mainCourses = await prisma.menuCategory.findFirst({
    where: { name: 'Main Courses' },
  });

  const desserts = await prisma.menuCategory.findFirst({
    where: { name: 'Desserts' },
  });

  const beverages = await prisma.menuCategory.findFirst({
    where: { name: 'Beverages' },
  });

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Garlic Bread',
        description: 'Crispy bread with garlic butter',
        price: 4.50,
        prepArea: PrepArea.KITCHEN,
        categoryId: appetizers?.id || 1,
        isAvailable: true,
      },
      {
        name: 'Grilled Chicken',
        description: 'Juicy grilled chicken breast',
        price: 12.99,
        prepArea: PrepArea.KITCHEN,
        categoryId: mainCourses?.id || 2,
        isAvailable: true,
      },
      {
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with vanilla ice cream',
        price: 6.99,
        prepArea: PrepArea.KITCHEN,
        categoryId: desserts?.id || 3,
        isAvailable: true,
      },
      {
        name: 'Iced Coffee',
        description: 'Cold brew coffee with milk',
        price: 3.50,
        prepArea: PrepArea.BAR,
        categoryId: beverages?.id || 4,
        isAvailable: true,
      },
      {
        name: 'Chef Special Pasta',
        description: 'Daily pasta special with seasonal ingredients',
        price: 14.99,
        prepArea: PrepArea.KITCHEN,
        categoryId: mainCourses?.id || 2,
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  // Get existing addons and side dishes for relationships
  const extraCheese = await prisma.menuAddon.findFirst({
    where: { name: 'Extra Cheese' },
  });

  const baconStrips = await prisma.menuAddon.findFirst({
    where: { name: 'Bacon Strips' },
  });

  const mushrooms = await prisma.menuAddon.findFirst({
    where: { name: 'Mushrooms' },
  });

  const frenchFries = await prisma.menuSideDish.findFirst({
    where: { name: 'French Fries' },
  });

  const sideSalad = await prisma.menuSideDish.findFirst({
    where: { name: 'Side Salad' },
  });

  // Add Ribeye Steak with side dishes
  const ribeyeSteak = await prisma.menuItem.create({
    data: {
      name: 'Ribeye Steak',
      description: 'Premium 12oz ribeye steak with your choice of side',
      price: 24.99,
      prepArea: PrepArea.KITCHEN,
      categoryId: mainCourses?.id || 2,
      isAvailable: true,
      hasAddons: false,
      requiresSideDish: true,
      sideDishes: {
        connect: [
          { id: frenchFries?.id || 1 },
          { id: sideSalad?.id || 2 },
        ],
      },
    },
  });

  // Add Pizza with addons
  const pizza = await prisma.menuItem.create({
    data: {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 11.99,
      prepArea: PrepArea.KITCHEN,
      categoryId: mainCourses?.id || 2,
      isAvailable: true,
      hasAddons: true,
      requiresSideDish: false,
      addons: {
        connect: [
          { id: extraCheese?.id || 1 },
          { id: baconStrips?.id || 2 },
          { id: mushrooms?.id || 5 },
        ],
      },
    },
  });
  

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  
