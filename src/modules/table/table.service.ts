import { Prisma, TableStatus } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createTable = async (
  data: Prisma.TableCreateInput
) => {
  const numberExists = await prisma.table.findFirst({
    where: { number: data.number },
  });
  if (numberExists) {
    throw new Error('Table with this number already exists');
  }
  return prisma.table.create({
    data,
  });
};

export const getAllTables = () => {
  return prisma.table.findMany();
};

export const getAvailableTables = async () => {
  // Get all available tables with their reservations
  const availableTables = await prisma.table.findMany({
    where: {
      status: TableStatus.AVAILABLE,
    },
    include: {
      reservations: {
        include: {
          reservation: true,
        },
      },
    },
  });

  // Calculate reservationDue for each table (30 min before reservation time)
  return availableTables.map((table) => {
    const reservationTables = table.reservations || [];
    const upcomingReservation = reservationTables
      .filter((rt: any) => {
        const reservationDate = new Date(rt.reservation.date);
        const now = new Date();
        return reservationDate > now;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.reservation.date).getTime();
        const dateB = new Date(b.reservation.date).getTime();
        return dateA - dateB;
      })[0];

    let reservationDue = null;
    if (upcomingReservation) {
      const reservationDate = new Date(upcomingReservation.reservation.date);
      reservationDue = new Date(reservationDate.getTime() - 30 * 60 * 1000).toISOString();
    }

    return {
      id: table.id,
      number: table.number,
      capacity: table.capacity,
      status: table.status,
      reservationDue,
    };
  });
};

export const getTableById = (id: number) => {
  return prisma.table.findUnique({
    where: { id },
  });
};

export const updateTable = async (
  id: number,
  data: Prisma.TableUpdateInput
) => {
  if (typeof data.number === 'number') {
    const numberExists = await prisma.table.findFirst({
      where: {
        number: data.number,
        NOT: {
          id,
        },
      },
    });
    if (numberExists) {
      throw new Error('Table with this number already exists');
    }
  }
  return prisma.table.update({
    where: { id },
    data,
  });
};

export const deleteTable = (id: number) => {
  return prisma.table.delete({
    where: { id },
  });
};
