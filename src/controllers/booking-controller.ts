import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
import { CreateBookingSchema, UpdateBookingSchema } from '@/schemas';

export async function getBookingByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBookingByUserId(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as CreateBookingSchema;

  try {
    const bookingId = await bookingService.createBooking(userId, roomId);

    return res.status(httpStatus.OK).send({ bookingId });
  } catch (error) {
    if (error.name === 'RoomNotAvailableError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as UpdateBookingSchema;
  const bookingId = Number(req.params.bookingId);

  if (isNaN(bookingId)) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const id = await bookingService.updateBooking(userId, roomId, bookingId);

    return res.status(httpStatus.OK).send({ bookingId: id });
  } catch (error) {
    if (error.name === 'RoomNotAvailableError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
