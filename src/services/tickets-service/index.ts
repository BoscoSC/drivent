import { TicketType, TicketStatus } from '@prisma/client';
import { CreateTicket, GetTicket } from '@/protocols';

import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

import { notFoundError } from '@/errors';

async function getAllTicketsTypes(): Promise<TicketType[]> {
  const ticketsTypes = await ticketRepository.findAllTicketsTypes();
  if (!ticketsTypes) throw notFoundError();

  return ticketsTypes;
}

async function getTicketByUser(userId: number): Promise<GetTicket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number): Promise<GetTicket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const data: CreateTicket = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };
  const ticket = await ticketRepository.create(data);

  return ticket;
}

async function getTicketById(id: number) {
  const ticket = await ticketRepository.findTicketById(id);
  if (!ticket) throw notFoundError();

  return ticket;
}

const ticketsService = {
  getAllTicketsTypes,
  getTicketByUser,
  getTicketById,
  createTicket,
};

export default ticketsService;
