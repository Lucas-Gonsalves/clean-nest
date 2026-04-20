import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/src/app.module'
import { PrismaService } from '@/src/prisma/prisma.service'

function generateUniqueDatabaseURL(schemaId: string) {
  const url = new URL(process.env.DATABASE_URL!)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

let app: INestApplication
let prisma: PrismaService
const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL

  execSync('pnpm prisma migrate deploy', {
    env: {
      ...process.env,
      DATABASE_URL: databaseURL,
    },
  })

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  app = moduleRef.createNestApplication()
  await app.init()

  prisma = app.get(PrismaService)
})

afterAll(async () => {
  if (prisma) {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
    await prisma.$disconnect()
  }

  if (app) {
    await app.close()
  }
})
