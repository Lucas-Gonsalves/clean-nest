import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { hash } from 'bcryptjs'
import { Server } from 'http'
import request from 'supertest'

import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Authenticate (E2E)', () => {
  let app: INestApplication<Server>
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  describe('[POST] /sessions', () => {
    it('should be able to authenticate', async () => {
      await studentFactory.makePrismaStudent({
        email: 'john@example.com',
        password: await hash('123456', 8),
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
