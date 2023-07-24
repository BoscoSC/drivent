import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getPaymentsByTicket, createPayment } from '@/controllers';
import { createPaymentSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentsByTicket)
  .post('/process', validateBody(createPaymentSchema), createPayment);

export { paymentsRouter };
