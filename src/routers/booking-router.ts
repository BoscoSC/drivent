import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getBookingByUser, createBooking, updateBooking } from '@/controllers';
import { createBookingSchema, updateBookingSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookingByUser)
  .post('/', validateBody(createBookingSchema), createBooking)
  .put('/:bookingId', validateBody(updateBookingSchema), updateBooking);

export { bookingRouter };
