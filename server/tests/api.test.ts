import 'dotenv/config'
import { beforeEach, describe, expect, vi, it, beforeAll } from 'vitest';
import { createApp } from '../src/app'
import { execSync } from 'child_process';

vi.mock('../src/prisma', async () => {
  const { PrismaClient } = await import('@prisma/client');
  return { default: new PrismaClient({ datasources: { db: { url: 'file:./test.db' } } }) }
})

const app = await createApp()

describe('API tests', () => {
  beforeAll(() => {
    // execSync(`DATABASE_URL="file:./test.db" npx prisma db push`);
  })

  beforeEach(async () => {
    vi.resetAllMocks()
  })

  it('Runs test', async () => {
    expect(1).toEqual(1)
  })
})