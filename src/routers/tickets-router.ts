import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketByUser, createTicket, getAllTicketsTypes } from '@/controllers';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getAllTicketsTypes)
  .get('/', getTicketByUser)
  .post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
