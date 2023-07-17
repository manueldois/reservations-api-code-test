import 'dotenv/config'
import { beforeEach, describe, expect, vi, it, beforeAll } from 'vitest';
import { createApp } from '../src/app'
import supertest from 'supertest'
import prisma from '../src/prisma';
import { Property, Reservation } from '@prisma/client';
import { promisify } from 'util';

const exec = promisify((await import('node:child_process')).exec);

vi.mock('../src/prisma', async () => {
  const { PrismaClient } = await import('@prisma/client');
  return { default: new PrismaClient({ datasources: { db: { url: 'file:./test.db' } } }) }
})

const defaultProperty: Omit<Property, 'id'> = {
  name: "The Grand Budapest Hotel"
}

const defaultReservation: Omit<Reservation, 'id'> = {
  startDate: new Date('2023-07-16 00:00:00.000'),
  endDate: new Date('2023-07-20 00:00:00.000'),
  propertyId: 1,
}

const viaJson = data => JSON.parse(JSON.stringify(data))

async function createProperty(data: Partial<Property> = {}): Promise<Property> {
  return prisma.property.create({
    data: { ...defaultProperty, ...data }
  })
}

async function createReservation(data: Partial<Reservation> = {}): Promise<Reservation> {
  return prisma.reservation.create({
    data: { ...defaultReservation, ...data }
  })
}

describe('API tests', () => {
  let request: any;

  beforeAll(async () => {
    // exec(`echo y | DATABASE_URL='file:./test.db' npx prisma migrate reset --force`);
    // const { stderr } = await exec(`DATABASE_URL='file:./test.db' npx prisma db push`)
    // if (stderr) {
    //   console.error(stderr)
    // }

    const app = await createApp()
    request = supertest(app)
  })

  beforeEach(async () => {
    await prisma.reservation.deleteMany({})
    await prisma.property.deleteMany({})
    await prisma.$queryRaw`DELETE FROM "sqlite_sequence";`
    vi.resetAllMocks()
  })

  it('Should get all reservations', async () => {
    await createProperty()
    const reservation = await createReservation()

    const response = await request.get('/v1/reservations');
    expect(response.status).toEqual(200);
    expect(response.body[0]).toMatchObject(viaJson(reservation));
  });

  it('Should create a new reservation', async () => {
    await createProperty()

    const reservation: Partial<Reservation> = {
      ...defaultReservation,
    };

    const response = await request.post('/v1/reservations').send(reservation);
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject(viaJson(reservation));
  });

  it('Should get a reservation by ID', async () => {
    await createProperty()
    await createReservation()

    const response = await request.get('/v1/reservations/1');
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ id: 1 });
  });

  it('Should update a reservation by ID', async () => {
    await createProperty()
    const reservation = await createReservation()

    const reservationUpdate = {
      startDate: new Date('2023-07-18 00:00:00.000'),
      endDate: new Date('2023-07-25 00:00:00.000'),
    };

    const response = await request.put('/v1/reservations/1').send(reservationUpdate);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(viaJson({ ...reservation, ...reservationUpdate }));
  });

  it('Should delete a reservation by ID', async () => {
    await createProperty()
    await createReservation()

    const response = await request.delete('/v1/reservations/1');
    expect(response.status).toEqual(200);
  });
})