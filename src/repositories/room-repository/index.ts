import { Room } from '@prisma/client';
import { prisma } from '@/config';

async function findRoomById(id: number) {
  return prisma.room.findUnique({
    where: {
      id,
    },
  });
}

export async function createRoom(data: CreateRoom) {
  return prisma.room.create({
    data,
  });
}

export type CreateRoom = Omit<Room, 'id' | 'updatedAt' | 'createdAt'>;

const roomRepository = {
  findRoomById,
  createRoom,
};

export default roomRepository;
