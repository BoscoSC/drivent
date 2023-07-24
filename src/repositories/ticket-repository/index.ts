import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';
import { CreateTicket } from '@/protocols';

async function findAllTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findTicketById(id: number) {
  return prisma.ticket.findUnique({
    where: {
      id,
    },
  });
}

async function create(data: CreateTicket) {
  return prisma.ticket.create({
    data,
    include: {
      TicketType: true,
    },
  });
}

async function update(id: number, status: TicketStatus) {
  return prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

const ticketRepository = {
  findAllTicketsTypes,
  findTicketByEnrollmentId,
  findTicketById,
  create,
  update,
};

export default ticketRepository;
