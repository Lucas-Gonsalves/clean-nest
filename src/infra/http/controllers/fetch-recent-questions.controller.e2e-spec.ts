import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { hash } from 'bcryptjs'
import { Server } from 'http'
import request from 'supertest'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'

describe('Fetch Recent Questions (E2E)', () => {
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

  describe('[GET] /questions', () => {
    it('should be able to fetch the recent questions', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          password: await hash('123456', 8),
        },
      })

      const accessToken = jwt.sign({ sub: user.id })

      await prisma.question.createMany({
        data: [
          {
            authorId: user.id,
            title: 'Question 01',
            slug: 'question-01',
            content: 'Content content',
          },
          {
            authorId: user.id,
            title: 'Question 02',
            slug: 'question-02',
            content: 'Content content',
          },
        ],
      })

      const response = await request(app.getHttpServer())
        .get('/questions')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        questions: [
          expect.objectContaining({ title: 'Question 01' }),
          expect.objectContaining({ title: 'Question 02' }),
        ],
      })
    })
  })
})
