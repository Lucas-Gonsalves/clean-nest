import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { Server } from 'http'
import request from 'supertest'

import { AppModule } from '../app.module'
import { PrismaService } from '../prisma/prisma.service'

describe('Create Question (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[POST] /questions', () => {
    it('should be able create a new question with valid data', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password: await hash('123456', 8),
        },
      })

      const accessToken = jwt.sign({ sub: user.id })

      const response = await request(app.getHttpServer())
        .post('/questions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'New Question',
          content: 'Content content',
        })

      const questionOnDatabase = await prisma.question.findFirst({ where: { title: 'New Question' } })

      expect(response.statusCode).toBe(201)
      expect(questionOnDatabase).toMatchObject({
        title: 'New Question',
        content: 'Content content',
      })
    })
  })
})
