import faker from '@faker-js/faker';
import { Booking } from '@prisma/client';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export function buildBookingInput(roomId: number): Booking {
  return {
    id: faker.datatype.number({ min: 1, max: 100 }),
    roomId,
    userId: faker.datatype.number({ min: 1, max: 100 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
