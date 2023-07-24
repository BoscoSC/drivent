import { Payment, TicketStatus } from '@prisma/client';
import { CreatePayment } from '@/protocols';
import { CreatePaymentSchema } from '@/schemas';

import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

import { notFoundError, unauthorizedError } from '@/errors';

async function getAllPaymentsByTicketId(ticketId: number): Promise<Payment> {
  const payments = await paymentRepository.findPaymentByTicketId(ticketId);
  if (!payments) throw notFoundError();

  return payments;
}

async function checkTicketByUser(userId: number, ticketId: number) {
  const ticketById = await ticketRepository.findTicketById(ticketId);
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!ticketById) throw notFoundError();
  if (ticketById.enrollmentId !== enrollment.id) throw unauthorizedError();
}

async function createPayment(userId: number, body: CreatePaymentSchema): Promise<Payment> {
  const { issuer, number } = body.cardData;
  const { ticketId } = body;

  const cardLastDigits = number.toString().slice(-4);

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  const data: CreatePayment = {
    cardIssuer: issuer,
    cardLastDigits,
    ticketId,
    value: ticket.TicketType.price,
  };

  const payment = await paymentRepository.create(data);
  await ticketRepository.update(ticketId, TicketStatus.PAID);

  return payment;
}

const paymentsService = {
  getAllPaymentsByTicketId,
  createPayment,
  checkTicketByUser,
};

export default paymentsService;
