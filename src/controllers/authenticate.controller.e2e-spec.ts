import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { Server } from 'http'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('Authenticate (E2E)', () => {
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

  describe('[POST] /sessions', () => {
    it('should be able to authenticate', async () => {
      await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password: await hash('123456', 8),
        },
      })

      const response = await request(app.getHttpServer()).post('/sessions').send({
        email: 'john@example.com',
        password: '123456',
      })

      expect(response.statusCode).toBe(201)
      expect(response.body).toMatchObject({
        access_token: expect.any(String),
      })
    })

    it('should not able to authenticate with wrong credentials', async () => {
      const response = await request(app.getHttpServer()).post('/sessions').send({
        email: 'john@example.com',
        password: 'wrong password',
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
