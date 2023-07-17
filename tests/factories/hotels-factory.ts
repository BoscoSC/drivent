import { faker } from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.name(),
      image: faker.image.urlPicsumPhotos(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.number.int({ min: 100, max: 1000 }).toString(),
      capacity: faker.number.int({ min: 1, max: 10 }),
      hotelId,
    },
  });
}

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
