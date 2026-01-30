import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createReservation = async (data: any) => {
  const { tableIds, ...reservationData } = data;

  if (!tableIds || tableIds.length === 0) {
    throw new Error('At least one table must be selected for the reservation.');
  }

  const tables = await prisma.table.findMany({
    where: {
      id: { in: tableIds },
    },
  });

  const totalCapacity = tables.reduce((acc, table) => acc + table.capacity, 0);

  if (data.numberOfGuests > totalCapacity) {
    throw new Error('Number of guests exceeds the total capacity of the selected tables.');
  }

  return prisma.reservation.create({
    data: {
      ...reservationData,
      tables: {
        create: tableIds.map((tableId: number) => ({
          table: {
            connect: { id: tableId },
          },
        })),
      },
    },
    include: {
      tables: {
        include: {
          table: true,
        },
      },
    },
  });
};

export const getAllReservations = () => {
  return prisma.reservation.findMany({
    include: {
      tables: {
        include: {
          table: true,
        },
      },
    },
  });
};

export const getTodayReservations = async () => {
  const todayUTC = new Date().toISOString().slice(0, 10);
  const start = new Date(`${todayUTC}T00:00:00.000Z`);
  const end = new Date(`${todayUTC}T23:59:59.999Z`);

  return prisma.reservation.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
      status: {
        notIn: ['CANCELLED', 'COMPLETED'],
      },
    },
    include: {
      tables: {
        include: {
          table: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
};

export const getReservationsByDateRange = async (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return prisma.reservation.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
      status: {
        notIn: ['CANCELLED', 'COMPLETED'],
      },
    },
    include: {
      tables: {
        include: {
          table: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
};

export const getBookedTables = async () => {
  const todayUTC = new Date().toISOString().slice(0, 10);
  const start = new Date(`${todayUTC}T00:00:00.000Z`);
  const end = new Date(`${todayUTC}T23:59:59.999Z`);

  const reservations = await prisma.reservation.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
      status: {
        notIn: ['CANCELLED', 'COMPLETED'],
      },
    },
    include: {
      tables: {
        include: {
          table: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Return unique tables with their reservation times
  const tablesMap = new Map();
  for (const reservation of reservations) {
    for (const rt of reservation.tables) {
      if (!tablesMap.has(rt.tableId)) {
        tablesMap.set(rt.tableId, {
          id: rt.table.id,
          number: rt.table.number,
          capacity: rt.table.capacity,
          status: rt.table.status,
          reservationTime: reservation.date,
        });
      }
    }
  }

  return Array.from(tablesMap.values());
};

export const getReservationById = (id: number) => {
  return prisma.reservation.findUnique({
    where: { id },
    include: {
      tables: {
        include: {
          table: true,
        },
      },
    },
  });
};

export const updateReservation = async (id: number, data: any) => {
  const { tableIds, ...reservationData } = data;

  if (tableIds) {
    const tables = await prisma.table.findMany({
      where: {
        id: { in: tableIds },
      },
    });

    const totalCapacity = tables.reduce((acc, table) => acc + table.capacity, 0);

    const reservation = await prisma.reservation.findUnique({
        where: { id },
    });

    if ((reservationData.numberOfGuests || reservation?.numberOfGuests) > totalCapacity) {
      throw new Error('Number of guests exceeds the total capacity of the selected tables.');
    }
  }

  return prisma.reservation.update({
    where: { id },
    data: {
      ...reservationData,
      tables: tableIds ? {
        deleteMany: {},
        create: tableIds.map((tableId: number) => ({
          table: {
            connect: { id: tableId },
          },
        })),
      } : undefined,
    },
    include: {
        tables: {
            include: {
                table: true,
            },
        },
    },
  });
};


export const deleteReservation = (id: number) => {
  return prisma.reservation.delete({
    where: { id },
  });
};
