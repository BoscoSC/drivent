import { faker } from '@faker-js/faker';
import { generateCPF, getStates } from '@brazilian-utils/brazilian-utils';
import { User } from '@prisma/client';

import { createUser } from './users-factory';
import { prisma } from '@/config';

export async function createEnrollmentWithAddress(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.enrollment.create({
    data: {
      name: faker.person.fullName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.number('(##) 9####-####'),
      userId: incomingUser.id,
      Address: {
        create: {
          street: faker.location.street(),
          cep: faker.location.zipCode(),
          city: faker.location.city(),
          neighborhood: faker.location.city(),
          number: faker.number.int().toString(),
          state: faker.helpers.arrayElement(getStates()).name,
        },
      },
    },
    include: {
      Address: true,
    },
  });
}

export function createhAddressWithCEP() {
  return {
    logradouro: 'Avenida Brigadeiro Faria Lima',
    complemento: 'de 3252 ao fim - lado par',
    bairro: 'Itaim Bibi',
    cidade: 'São Paulo',
    uf: 'SP',
  };
}
