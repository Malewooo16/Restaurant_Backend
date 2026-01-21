import { prisma } from "../../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

export const validateOrderItems = async (
  orderItems: {
    menuItemId: number;
    quantity: number;
    notes?: string;
    selectedSideDishes?: number[];
    selectedAddons?: number[];
  }[]
) => {
    let total = 0;
    const orderItemData = await Promise.all(
      orderItems.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
          include: {
            sideDishes: true,
            addons: true,
          },
        });
        if (!menuItem) {
          throw new Error(`Menu item with id ${item.menuItemId} not found`);
        }

        if (item.selectedSideDishes && item.selectedSideDishes.length > 0) {
          if (!menuItem.requiresSideDish) {
            throw new Error(
              `Menu item ${menuItem.name} does not support side dishes`
            );
          }

          const availableSideDishIds = menuItem.sideDishes.map((sd) => sd.id);
          const invalidSideDishes = item.selectedSideDishes.filter(
            (id) => !availableSideDishIds.includes(id)
          );
          if (invalidSideDishes.length > 0) {
            throw new Error(
              `Side dish(es) ${invalidSideDishes.join(
                ", "
              )} are not available for ${menuItem.name}`
            );
          }
        }

        if (item.selectedAddons && item.selectedAddons.length > 0) {
          if (!menuItem.hasAddons) {
            throw new Error(`Menu item ${menuItem.name} does not support addons`);
          }

          const availableAddonIds = menuItem.addons.map((addon) => addon.id);
          const invalidAddons = item.selectedAddons.filter(
            (id) => !availableAddonIds.includes(id)
          );
          if (invalidAddons.length > 0) {
            throw new Error(
              `Addon(s) ${invalidAddons.join(", ")} are not available for ${
                menuItem.name
              }`
            );
          }
        }
        let itemTotal = menuItem.price;

        if (item.selectedSideDishes && item.selectedSideDishes.length > 0) {
          const sideDishes = await prisma.menuSideDish.findMany({
            where: { id: { in: item.selectedSideDishes } },
          });
          if (sideDishes.length !== item.selectedSideDishes.length) {
            const foundIds = sideDishes.map((sd) => sd.id);
            const missingIds = item.selectedSideDishes.filter(
              (id) => !foundIds.includes(id)
            );
            throw new Error(
              `Side dish(es) with id(s) ${missingIds.join(", ")} not found`
            );
          }
          itemTotal += sideDishes.reduce((sum, sd) => sum + sd.price, 0);
        }

        if (item.selectedAddons && item.selectedAddons.length > 0) {
          const addons = await prisma.menuAddon.findMany({
            where: { id: { in: item.selectedAddons } },
          });
          if (addons.length !== item.selectedAddons.length) {
            const foundIds = addons.map((addon) => addon.id);
            const missingIds = item.selectedAddons.filter(
              (id) => !foundIds.includes(id)
            );
            throw new Error(
              `Addon(s) with id(s) ${missingIds.join(", ")} not found`
            );
          }
          itemTotal += addons.reduce((sum, addon) => sum + addon.price, 0);
        }

        total += itemTotal * item.quantity;

        return {
          quantity: item.quantity,
          price: itemTotal,
          notes: item.notes,
          prepArea: menuItem.prepArea,
          menuItem: {
            connect: {
              id: menuItem.id,
            },
          },
          selectedSideDishes: item.selectedSideDishes,
          selectedAddons: item.selectedAddons,
        };
      })
    );
    return { orderItemData, total };
  };