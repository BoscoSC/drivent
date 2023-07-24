import { ApplicationError } from '@/protocols';

export function roomNotAvailableError(): ApplicationError {
  return {
    name: 'RoomNotAvailableError',
    message: 'Room not available!',
  };
}
