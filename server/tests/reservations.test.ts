import 'dotenv/config'
import { describe, expect, it, beforeAll, beforeEach } from '@jest/globals';
import supertest from 'supertest'
import { createApp } from '../src/app'
import { viaJson } from '../src/util';
import { createProperty, createReservation, resetDB } from './controllers';
import { defaultReservation } from './mocks/mock_data';

// @ts-ignore
jest.mock('../src/prisma', () => {
  // @ts-ignore
  const { PrismaClient } = jest.requireActual('@prisma/client');

  return {
    __esModule: true,
    default: new PrismaClient({
      datasources: {
        db: {
          url: 'file:./test.db'
        }
      }
    })
  }
})

describe('Reservations API', () => {
  const reservationsURL = '/v1/reservations'
  let request: any;

  beforeAll(async () => {
    const app = await createApp()
    request = supertest(app)
  })

  beforeEach(async () => {
    await resetDB()
  })

  it('Should get all reservations', async () => {
    await createProperty()
    const reservation = await createReservation()

    const response = await request.get(`${reservationsURL}`);
    expect(response.status).toEqual(200);
    expect(response.body[0]).toMatchObject(viaJson(reservation));
  });

  it('Should create a new reservation', async () => {
    await createProperty()

    const response = await request.post(`${reservationsURL}`).send(defaultReservation);
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject(viaJson(defaultReservation));
  });

  it('Should get a reservation by ID', async () => {
    await createProperty()
    await createReservation()

    const response = await request.get(`${reservationsURL}/1`);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({ id: 1 });
  });

  it('Should update a reservation by ID', async () => {
    await createProperty()
    const reservation = await createReservation()

    const reservationUpdate = {
      startDate: '2023-07-18',
      endDate: '2023-07-25',
    };

    const response = await request.put(`${reservationsURL}/1`).send(reservationUpdate);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(viaJson({ ...reservation, ...reservationUpdate }));
  });

  it('Should delete a reservation by ID', async () => {
    await createProperty()
    await createReservation()

    const response = await request.delete(`${reservationsURL}/1`);
    expect(response.status).toEqual(200);
  });
})