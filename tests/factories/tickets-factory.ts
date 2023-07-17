import { faker } from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';
import maxInt4Value from '@/utils/constants';

interface TicketTypeOptions {
  isRemoteTicket?: boolean;
  includesHotelTicket?: boolean;
}

export async function createTicketType(options?: TicketTypeOptions) {
  const isRemoteTicket = options?.isRemoteTicket ?? false;
  const includesHotelTicket = options?.includesHotelTicket ?? false;
  return prisma.ticketType.create({
    data: {
      name: faker.person.fullName(),
      price: faker.number.int(maxInt4Value),
      isRemote: faker.datatype.boolean(isRemoteTicket ? 1 : 0),
      includesHotel: faker.datatype.boolean(includesHotelTicket ? 1 : 0),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
