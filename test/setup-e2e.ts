import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@src/generated/prisma/client'

const schema = randomUUID()
const baseUrl = new URL(process.env.DATABASE_URL as string)

const databaseURL = new URL(baseUrl)
databaseURL.searchParams.set('schema', schema)

process.env.DATABASE_URL = databaseURL.toString()

execSync('pnpm prisma migrate deploy', {
  env: {
    ...process.env,
    DATABASE_URL: databaseURL.toString(),
  },
})

const adapter = new PrismaPg({ connectionString: baseUrl.toString() }, { schema })

const prisma = new PrismaClient({
  adapter,
  log: ['warn', 'error'],
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  await prisma.$disconnect()
})
