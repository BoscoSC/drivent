import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import { Event } from '@prisma/client';
import { prisma } from '@/config';

export function createEvent(params: Partial<Event> = {}): Promise<Event> {
  return prisma.event.create({
    data: {
      title: params.title || faker.lorem.sentence(),
      backgroundImageUrl: params.backgroundImageUrl || faker.image.url(),
      logoImageUrl: params.logoImageUrl || faker.image.url(),
      startsAt: params.startsAt || dayjs().subtract(1, 'day').toDate(),
      endsAt: params.endsAt || dayjs().add(5, 'days').toDate(),
    },
  });
}
