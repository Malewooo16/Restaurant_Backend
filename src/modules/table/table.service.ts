import { Prisma, TableStatus } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createTable = async (
  data: { number: number; capacity: number; status?: TableStatus },
  userId: number
) => {
  const numberExists = await prisma.table.findFirst({
    where: { number: data.number },
  });
  if (numberExists) {
    throw new Error('Table with this number already exists');
  }
  return prisma.table.create({
    data: {
      number: data.number,
      capacity: data.capacity,
      status: data.status,
      createdById: userId,
      updatedById: userId,
    },
  });
};

export const getAllTables = () => {
  return prisma.table.findMany();
};

export const getAvailableTables = async (date?: string) => {
  const now = new Date();
  
  // If reservation date is specified and is in the future, show all tables
  // If no date or date is today, only show AVAILABLE tables
  let reservationDate: Date | undefined;
  if (date) {
    reservationDate = new Date(date);
    // Set to midnight for comparison
    reservationDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If reservation is for today, filter by AVAILABLE status
    // If reservation is for future date, show only tables without reservations for that date
    const isToday = reservationDate.getTime() === today.getTime();
    if (!isToday) {
      // Future date - show only tables that are NOT reserved for this specific date
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const allTables = await prisma.table.findMany({
        where: {
          NOT: {
            reservations: {
              some: {
                reservation: {
                  date: {
                    gte: dayStart,
                    lte: dayEnd,
                  },
                },
              },
            },
          },
        },
        include: {
          reservations: {
            where: {
              reservation: {
                date: {
                  gte: dayStart,
                  lte: dayEnd,
                },
              },
            },
            include: {
              reservation: true,
            },
          },
        },
      });

      return allTables.map((table) => ({
        id: table.id,
        number: table.number,
        capacity: table.capacity,
        status: table.status,
        reservationDue: null,
      }));
    }
  }

  // Today's reservation - show AVAILABLE tables with reservationDue info
  // Tables within 30 min of reservation will be marked but not hidden
  const availableTables = await prisma.table.findMany({
    where: {
      status: TableStatus.AVAILABLE,
    },
    include: {
      reservations: {
        where: {
          reservation: {
            date: {
              gte: now,
            },
          },
        },
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
        const reservationDateTime = new Date(rt.reservation.date);
        return reservationDateTime > now;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.reservation.date).getTime();
        const dateB = new Date(b.reservation.date).getTime();
        return dateA - dateB;
      })[0];

    let reservationDue = null;
    if (upcomingReservation) {
      const reservationDateTime = new Date(upcomingReservation.reservation.date);
      reservationDue = new Date(reservationDateTime.getTime() - 30 * 60 * 1000).toISOString();
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
  data: { number?: number; capacity?: number; status?: TableStatus },
  userId: number
) => {
  if (data.number) {
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
    data: {
      number: data.number,
      capacity: data.capacity,
      status: data.status,
      updatedById: userId,
    },
  });
};

export const deleteTable = (id: number) => {
  return prisma.table.delete({
    where: { id },
  });
};
