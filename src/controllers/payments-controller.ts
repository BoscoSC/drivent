import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import { CreatePaymentSchema } from '@/schemas';

export async function getPaymentsByTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = Number(req.query.ticketId);

  if (!ticketId || isNaN(ticketId)) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    await paymentsService.checkTicketByUser(userId, ticketId);

    const payments = await paymentsService.getAllPaymentsByTicketId(ticketId);

    return res.status(httpStatus.OK).send(payments);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.body as CreatePaymentSchema;

  try {
    await paymentsService.checkTicketByUser(userId, ticketId);
    const payment = await paymentsService.createPayment(userId, req.body);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
