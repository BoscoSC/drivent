import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import dotenv from 'dotenv';
import { createUser } from './factories';
import { createSession } from './factories/sessions-factory';
import { prisma } from '@/config';

dotenv.config();

export async function cleanDb() {
  await prisma.address.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
}

export async function generateValidToken(user?: User) {
  console.log(process.env.JWT_SECRET);
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
