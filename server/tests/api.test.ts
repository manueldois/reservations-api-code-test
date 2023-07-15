import 'dotenv/config'
import { beforeEach, describe, expect, vi, it } from 'vitest';
import { createApp } from '../src/app'

vi.mock('../src/services/sequelize', async () => {
  const { Sequelize } = await import('sequelize');
  return { sequelize: new Sequelize('sqlite::memory:', { logging: false }) }
})

const app = await createApp()

describe('API tests', () => {
  beforeEach(async () => {
    vi.resetAllMocks()
  })

  it('Runs test', async () => {
    expect(1).toEqual(1)
  })
})