import faker from '@faker-js/faker';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createRandomTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketType(isRemote: boolean, includesHotel: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote,
      includesHotel: includesHotel,
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

export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export function buildTicketType(includesHotel: boolean, isRemote: boolean): TicketType {
  return {
    id: faker.datatype.number({ min: 1, max: 100 }),
    includesHotel,
    isRemote,
    name: faker.name.jobType(),
    price: faker.datatype.float({ min: 100, max: 800, precision: 0.01 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function buildTicket(status: TicketStatus, ticketTypeId: number, enrollmentId: number): Ticket {
  return {
    id: faker.datatype.number({ min: 1, max: 100 }),
    enrollmentId,
    status,
    ticketTypeId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
