import { TicketStatus } from '@prisma/client';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

import { notFoundError, paymentError } from '@/errors';

async function checkEnrollmentAndTicketByUser(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const isTicketPaid = ticket.status === TicketStatus.PAID;
  const isTicketTypeRemote = ticket.TicketType.isRemote;
  const ticketTypeIncludesHotel = ticket.TicketType.includesHotel;

  if (!isTicketPaid) throw paymentError('Payment required!');
  if (isTicketTypeRemote) throw paymentError('Ticket type cannot be remote!');
  if (!ticketTypeIncludesHotel) throw paymentError('Ticket type must includes hotel!');
}

async function getAllHotels() {
  const hotels = await hotelRepository.findAllHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelById(id: number) {
  const hotel = await hotelRepository.findHotelById(id);
  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = {
  getAllHotels,
  getHotelById,
  checkEnrollmentAndTicketByUser,
};

export default hotelsService;
