import roomRepository, { CreateRoom } from '@/repositories/room-repository';

import { notFoundError } from '@/errors';

async function getRoomById(id: number) {
  const room = await roomRepository.findRoomById(id);
  if (!room) throw notFoundError();

  return room;
}

async function createRoom(data: CreateRoom) {
  const room = await roomRepository.createRoom(data);

  return room;
}

const roomsService = {
  getRoomById,
  createRoom,
};

export default roomsService;
