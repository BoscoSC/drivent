import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/tickets-service';
import { InputTicketBody } from '@/protocols';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  const ticketTypes = await ticketService.getTicketType();
  return res.status(httpStatus.OK).send(ticketTypes);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const ticket = await ticketService.getTicketByUserId(userId);
  return res.status(httpStatus.OK).send(ticket);
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body as InputTicketBody;

  if (!ticketTypeId) return res.sendStatus(httpStatus.BAD_REQUEST);

  const ticket = await ticketService.createTicket(userId, ticketTypeId);
  return res.status(httpStatus.CREATED).send(ticket);
}
