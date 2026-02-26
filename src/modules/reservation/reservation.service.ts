import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createReservation = async (data: any, userId: number) => {
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
      customerName: reservationData.customerName,
      customerPhone: reservationData.customerPhone,
      customerEmail: reservationData.customerEmail,
      date: reservationData.date,
      numberOfGuests: reservationData.numberOfGuests,
      status: reservationData.status,
      notes: reservationData.notes,
      createdById: userId,
      updatedById: userId,
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

interface GetReservationsParams {
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
}

export const getReservations = async (params: GetReservationsParams) => {
  const { startDate, endDate, status, search } = params;

  // Build where clause
  const where: any = {};

  // Date range filter - use the provided dates directly
  if (startDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(startDate);
  
    where.date = {
      gte: start,
      lte: end,
    };
  }

  // Status filter
  if (status && status !== 'all') {
    where.status = status;
  }

  // Search filter (customer name, phone, email)
  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { customerPhone: { contains: search } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.reservation.findMany({
    where,
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
  const todayUTC = new Date().toISOString().split('T')[0];
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

export const updateReservation = async (id: number, data: any, userId: number) => {
  const { tableIds, ...reservationData } = data;

  // Get current reservation to know old tables
  const currentReservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      tables: {
        include: { table: true },
      },
    },
  });

  if (!currentReservation) {
    throw new Error('Reservation not found');
  }

  if (tableIds) {
    const tables = await prisma.table.findMany({
      where: {
        id: { in: tableIds },
      },
    });

    const totalCapacity = tables.reduce((acc, table) => acc + table.capacity, 0);

    if ((reservationData.numberOfGuests || currentReservation.numberOfGuests) > totalCapacity) {
      throw new Error('Number of guests exceeds the total capacity of the selected tables.');
    }
  }

  // Update tables within a transaction
  return prisma.$transaction(async (tx) => {
    // If tableIds are being updated, handle table status changes
    if (tableIds) {
      const oldTableIds = currentReservation.tables.map((rt) => rt.tableId);
      const newTableIds = tableIds;

      // Free up old tables (set to AVAILABLE)
      if (oldTableIds.length > 0) {
        await tx.table.updateMany({
          where: { id: { in: oldTableIds } },
          data: { status: 'AVAILABLE' },
        });
      }

      // Mark new tables as OCCUPIED
      if (newTableIds.length > 0) {
        await tx.table.updateMany({
          where: { id: { in: newTableIds } },
          data: { status: 'OCCUPIED' },
        });
      }
    }

    // Update the reservation
    return tx.reservation.update({
      where: { id },
      data: {
        customerName: reservationData.customerName,
        customerPhone: reservationData.customerPhone,
        customerEmail: reservationData.customerEmail,
        date: reservationData.date,
        numberOfGuests: reservationData.numberOfGuests,
        status: reservationData.status,
        notes: reservationData.notes,
        updatedById: userId,
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
  });
};

export const cancelReservation = async (id: number, userId: number) => {
  // Get the reservation with its tables
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      tables: {
        include: { table: true },
      },
    },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  // Update reservation status to CANCELLED and free tables
  return prisma.$transaction(async (tx) => {
    // Update all tables to AVAILABLE
    const tableIds = reservation.tables.map((rt) => rt.tableId);
    if (tableIds.length > 0) {
      await tx.table.updateMany({
        where: { id: { in: tableIds } },
        data: { status: 'AVAILABLE' },
      });
    }

    // Update reservation status
    return tx.reservation.update({
      where: { id },
      data: { status: 'CANCELLED', updatedById: userId },
      include: {
        tables: {
          include: {
            table: true,
          },
        },
      },
    });
  });
};


export const deleteReservation = (id: number) => {
  return prisma.reservation.delete({
    where: { id },
  });
};
