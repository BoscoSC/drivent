import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    await hotelsService.checkEnrollmentAndTicketByUser(userId);
    const hotels = await hotelsService.getAllHotels();

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'PaymentError') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send({
        message: error.message,
      });
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  if (isNaN(hotelId) || !hotelId) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }

  try {
    await hotelsService.checkEnrollmentAndTicketByUser(userId);
    const hotel = await hotelsService.getHotelById(hotelId);

    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === 'PaymentError') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send({
        message: error.message,
      });
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
