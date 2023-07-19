import 'dotenv/config'
import { describe, expect, it, beforeAll, beforeEach } from '@jest/globals';
import supertest from 'supertest'
import { createApp } from '../src/app'
import { viaJson } from '../src/util';
import { createProperty, createReservation, resetDB } from './controllers';
import { defaultProperty } from './mocks/mock_data';
import prisma from '../src/prisma';

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

describe('Properties API', () => {
  const propertiesURL = '/v1/properties'
  let request: any;

  beforeAll(async () => {
    const app = await createApp()
    request = supertest(app)
  })

  beforeEach(async () => {
    await resetDB()
  })

  it('Should get all properties', async () => {
    const property = await createProperty()

    const response = await request.get(`${propertiesURL}`);
    expect(response.status).toEqual(200);
    expect(response.body[0]).toMatchObject(viaJson(property));
  });

  it('Should create a new property', async () => {
    const response = await request.post(`${propertiesURL}`).send(defaultProperty);
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject(viaJson(defaultProperty));
  });

  it('Should get a property by ID', async () => {
    const property = await createProperty()

    const response = await request.get(`${propertiesURL}/1`);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(property);
  });

  it('Should update a property by ID', async () => {
    const property = await createProperty()

    const propertyUpdate = {
      name: "Timberline Lodge"
    };

    const response = await request.put(`${propertiesURL}/1`).send(propertyUpdate);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(viaJson({ ...property, ...propertyUpdate }));
  });

  it('Should delete a property by ID, and cascade to it\'s reservations', async () => {
    await createProperty()
    await createReservation()

    const resDeleteProperty = await request.delete(`${propertiesURL}/1`);
    expect(resDeleteProperty.status).toEqual(200);

    const reservation = await prisma.reservation.findFirst({ where: { id: 1 } })
    expect(reservation).toBe(null)
  });
})