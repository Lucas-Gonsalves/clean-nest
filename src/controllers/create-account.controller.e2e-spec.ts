import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Server } from 'http'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('Create Account (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  describe('[POST] /accounts', () => {
    it('should be able create a new account with valid data', async () => {
      const response = await request(app.getHttpServer()).post('/accounts').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      })

      const userOnDatabase = await prisma.user.findUnique({ where: { email: 'john@example.com' } })

      expect(response.statusCode).toBe(201)
      expect(userOnDatabase).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
      })
    })

    it('should not create an account with a duplicated email', async () => {
      const response = await request(app.getHttpServer()).post('/accounts').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      })

      expect(response.statusCode).toBe(409)
    })
  })
})
