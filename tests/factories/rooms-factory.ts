import faker from '@faker-js/faker';
import { Room } from '@prisma/client';
import { prisma } from '@/config';

export async function createRandomRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      hotelId,
    },
  });
}

export async function createRoom(hotelId: number, capacity: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity,
      hotelId,
    },
  });
}

export function buildRoom(): Room {
  return {
    id: faker.datatype.number({ min: 1, max: 100 }),
    capacity: 1,
    hotelId: faker.datatype.number({ min: 1, max: 100 }),
    name: faker.company.companyName(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
