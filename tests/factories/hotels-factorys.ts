import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function newHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      imagem: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 3,
      hotelId: hotelId,
    },
  });
}
