import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function newHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: 'teste',
      capacity: 13,
      hotelId: hotelId,
    },
  });
}
