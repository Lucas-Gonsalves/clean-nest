import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Create Question (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let studentFactory: StudentFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[POST] /questions', () => {
    it('should be able create a new question with valid data', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id.toString() })

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
