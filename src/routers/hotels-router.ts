import { Router, Response } from 'express';
import { AuthenticatedRequest, authenticateToken } from '../middlewares';
import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';
import { prisma } from '@/config';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', monolithOne).get('/:hotelId', monolithTwo);

async function monolithOne(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment === null) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket === null) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentRequiredError();

  const hotels = await prisma.hotel.findMany();

  if (hotels.length === 0) throw notFoundError();

  res.send(hotels);
}

async function monolithTwo(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment === null) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket === null) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentRequiredError();

  const hotel = await prisma.hotel.findFirst({
    where: {
      id: Number(hotelId),
    },
    include: {
      Rooms: true,
    },
  });

  if (hotel === null) throw notFoundError();

  res.send(hotel);
}

export { hotelsRouter };
