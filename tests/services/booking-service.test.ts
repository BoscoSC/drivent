import { Booking, Enrollment, Room, Ticket, TicketStatus, TicketType } from '@prisma/client';
import { cleanDb } from '../helpers';
import { buildBookingInput, buildEnrollment, buildRoom, buildTicket, buildTicketType } from '../factories';
import ticketsService from '@/services/tickets-service';
import bookingService from '@/services/booking-service';
import { init } from '@/app';
import bookingRepository from '@/repositories/booking-repository';
import roomsService from '@/services/rooms-service';

type GetBooking = {
  id: number;
  Room: Room;
};

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('booking service', () => {
  describe('get booking tests', () => {
    it('should return a specific booking when a valid userId is provided', async () => {
      const mockRoom: Room = { ...buildRoom() };
      const mockBookingCreate: Booking = {
        ...buildBookingInput(mockRoom.id),
      };

      const mockBooking: GetBooking = {
        id: mockBookingCreate.id,
        Room: mockRoom,
      };

      jest.spyOn(bookingRepository, 'createBooking').mockResolvedValueOnce(mockBookingCreate);
      jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(mockBooking);
      const booking = await bookingService.getBookingByUserId(1);
      expect(booking).toEqual(mockBooking);
    });

    it('should return notFoundError when specific booking is not found', async () => {
      jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(null);

      const promise = bookingService.getBookingByUserId(1);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });

  describe('create booking tests', () => {
    it('should throw an error when user does not have ticket', async () => {
      jest.spyOn(ticketsService, 'getTicketByUser').mockResolvedValueOnce(null);
      const promise = bookingService.createBooking(1, 23);
      expect(promise).rejects.toEqual({
        name: 'RoomNotAvailableError',
        message: 'Room not available!',
      });
    });

    it('should throw an error when user does not pay the ticket', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const ticketType: TicketType = { ...buildTicketType(true, false) };
      const ticket: Ticket = { ...buildTicket(TicketStatus.RESERVED, ticketType.id, enrollment.id) };
      const room: Room = { ...buildRoom() };

      const mockTicket = {
        ...ticket,
        TicketType: { ...ticketType },
      };

      jest.spyOn(ticketsService, 'getTicketByUser').mockResolvedValueOnce(mockTicket);
      const promise = bookingService.createBooking(enrollment.userId, room.id);
      expect(promise).rejects.toEqual({
        name: 'RoomNotAvailableError',
        message: 'Room not available!',
      });
    });

    it('should throw an error when users ticket does not include hotel', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const ticketType: TicketType = { ...buildTicketType(false, false) };
      const ticket: Ticket = { ...buildTicket(TicketStatus.PAID, ticketType.id, enrollment.id) };
      const room: Room = { ...buildRoom() };

      const mockTicket = {
        ...ticket,
        TicketType: { ...ticketType },
      };

      jest.spyOn(ticketsService, 'getTicketByUser').mockResolvedValueOnce(mockTicket);
      const promise = bookingService.createBooking(enrollment.userId, room.id);
      expect(promise).rejects.toEqual({
        name: 'RoomNotAvailableError',
        message: 'Room not available!',
      });
    });

    it('should throw an error when users ticket is remote', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const ticketType: TicketType = { ...buildTicketType(true, true) };
      const ticket: Ticket = { ...buildTicket(TicketStatus.PAID, ticketType.id, enrollment.id) };
      const room: Room = { ...buildRoom() };

      const mockTicket = {
        ...ticket,
        TicketType: { ...ticketType },
      };

      jest.spyOn(ticketsService, 'getTicketByUser').mockResolvedValueOnce(mockTicket);
      const promise = bookingService.createBooking(enrollment.userId, room.id);
      expect(promise).rejects.toEqual({
        name: 'RoomNotAvailableError',
        message: 'Room not available!',
      });
    });

    it('should throw an error when room does not exist', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const ticketType: TicketType = { ...buildTicketType(true, false) };
      const ticket: Ticket = { ...buildTicket(TicketStatus.PAID, ticketType.id, enrollment.id) };

      const mockTicket = {
        ...ticket,
        TicketType: { ...ticketType },
      };

      jest.spyOn(ticketsService, 'getTicketByUser').mockResolvedValueOnce(mockTicket);
      jest.spyOn(roomsService, 'getRoomById').mockResolvedValueOnce(null);
      const promise = bookingService.createBooking(enrollment.userId, 1);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should throw an error when room is full', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const ticketType: TicketType = { ...buildTicketType(true, false) };
      const ticket: Ticket = { ...buildTicket(TicketStatus.PAID, ticketType.id, enrollment.id) };

      const mockRoom: Room = { ...buildRoom() };
      const mockBookingCreate: Booking = {
        ...buildBookingInput(mockRoom.id),
      };

      const mockTicket = {
        ...ticket,
        TicketType: { ...ticketType },
      };

      jest.spyOn(ticketsService, 'getTicketByUser').mockResolvedValueOnce(mockTicket);
      jest.spyOn(roomsService, 'getRoomById').mockResolvedValueOnce(mockRoom);
      jest.spyOn(bookingRepository, 'findBookingsByRoomId').mockResolvedValueOnce([mockBookingCreate]);

      const promise = bookingService.createBooking(enrollment.userId, mockRoom.id);
      expect(promise).rejects.toEqual({
        name: 'RoomNotAvailableError',
        message: 'Room not available!',
      });
    });

    it('should create a booking', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const ticketType: TicketType = { ...buildTicketType(true, false) };
      const ticket: Ticket = { ...buildTicket(TicketStatus.PAID, ticketType.id, enrollment.id) };

      const mockRoom: Room = { ...buildRoom() };

      const mockTicket = {
        ...ticket,
        TicketType: { ...ticketType },
      };

      jest.spyOn(ticketsService, 'getTicketByUser').mockResolvedValueOnce(mockTicket);
      jest.spyOn(roomsService, 'getRoomById').mockResolvedValueOnce(mockRoom);
      jest.spyOn(bookingRepository, 'findBookingsByRoomId').mockResolvedValueOnce([]);
      jest.spyOn(bookingService, 'createBooking').mockResolvedValue(null);

      await bookingService.createBooking(enrollment.userId, mockRoom.id);
    });
  });

  describe('update booking tests', () => {
    it('should throw an error when user does not have booking', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const mockRoom: Room = { ...buildRoom() };

      jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(null);

      const promise = bookingService.updateBooking(enrollment.userId, mockRoom.id, 123);
      expect(promise).rejects.toEqual({
        name: 'RoomNotAvailableError',
        message: 'Room not available!',
      });
    });

    it('should throw an error when booking id does not exist', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const mockRoom: Room = { ...buildRoom() };
      const mockBookingCreate: Booking = {
        ...buildBookingInput(mockRoom.id),
      };

      const mockBooking: GetBooking = {
        id: mockBookingCreate.id,
        Room: mockRoom,
      };

      jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(mockBooking);

      jest.spyOn(bookingRepository, 'findBookingById').mockResolvedValueOnce(null);

      const promise = bookingService.updateBooking(enrollment.userId, mockRoom.id, 123);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should throw an error when booking id is not the same as the users booking id', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const mockRoom: Room = { ...buildRoom() };
      const mockBookingCreate: Booking = {
        ...buildBookingInput(mockRoom.id),
      };

      const anotherBookingCreate: Booking = {
        ...buildBookingInput(mockRoom.id),
      };

      const mockBooking: GetBooking = {
        id: mockBookingCreate.id,
        Room: mockRoom,
      };

      const anotherMockBooking: GetBooking = {
        id: anotherBookingCreate.id,
        Room: mockRoom,
      };

      jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(mockBooking);

      jest.spyOn(bookingRepository, 'findBookingById').mockResolvedValueOnce(anotherMockBooking);

      const promise = bookingService.updateBooking(enrollment.userId, mockRoom.id, anotherMockBooking.id);
      expect(promise).rejects.toEqual({
        name: 'RoomNotAvailableError',
        message: 'Room not available!',
      });
    });

    it('should throw an error when room does not exist', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const mockRoom: Room = { ...buildRoom() };

      const mockBookingCreate: Booking = {
        ...buildBookingInput(mockRoom.id),
      };

      const mockBooking: GetBooking = {
        id: mockBookingCreate.id,
        Room: mockRoom,
      };

      jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(mockBooking);
      jest.spyOn(bookingRepository, 'findBookingById').mockResolvedValueOnce(mockBooking);
      jest.spyOn(roomsService, 'getRoomById').mockResolvedValueOnce(null);

      const promise = bookingService.updateBooking(enrollment.userId, 123, mockBookingCreate.id);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should throw an error when room is full', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const mockRoom: Room = { ...buildRoom() };
      const anotherMockRoom: Room = { ...buildRoom() };
      const mockBookingCreate: Booking = {
        ...buildBookingInput(mockRoom.id),
      };
      const anotherMockBookingCreate: Booking = {
        ...buildBookingInput(anotherMockRoom.id),
      };

      const mockBooking: GetBooking = {
        id: mockBookingCreate.id,
        Room: mockRoom,
      };

      jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(mockBooking);
      jest.spyOn(bookingRepository, 'findBookingById').mockResolvedValueOnce(mockBooking);
      jest.spyOn(roomsService, 'getRoomById').mockResolvedValueOnce(mockRoom);
      jest.spyOn(bookingRepository, 'findBookingsByRoomId').mockResolvedValueOnce([anotherMockBookingCreate]);

      const promise = bookingService.updateBooking(enrollment.userId, anotherMockRoom.id, mockBookingCreate.id);
      expect(promise).rejects.toEqual({
        name: 'RoomNotAvailableError',
        message: 'Room not available!',
      });
    });

    it('should update a booking', async () => {
      const enrollment: Enrollment = { ...buildEnrollment() };
      const mockRoom: Room = { ...buildRoom() };
      const anotherMockRoom: Room = { ...buildRoom() };
      const mockBookingCreate: Booking = {
        ...buildBookingInput(mockRoom.id),
      };

      const mockBooking: GetBooking = {
        id: mockBookingCreate.id,
        Room: mockRoom,
      };

      jest.spyOn(bookingRepository, 'findBooking').mockResolvedValueOnce(mockBooking);
      jest.spyOn(bookingRepository, 'findBookingById').mockResolvedValueOnce(mockBooking);
      jest.spyOn(roomsService, 'getRoomById').mockResolvedValueOnce(mockRoom);
      jest.spyOn(bookingRepository, 'findBookingsByRoomId').mockResolvedValueOnce([]);
      jest.spyOn(bookingService, 'updateBooking').mockResolvedValue(null);

      bookingService.updateBooking(enrollment.userId, anotherMockRoom.id, mockBookingCreate.id);
    });
  });
});
