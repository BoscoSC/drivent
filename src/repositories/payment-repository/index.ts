import { prisma } from '@/config';
import { CreatePayment } from '@/protocols';

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function create(data: CreatePayment) {
  return prisma.payment.create({
    data,
  });
}

const paymentRepository = {
  findPaymentByTicketId,
  create,
};

export default paymentRepository;
