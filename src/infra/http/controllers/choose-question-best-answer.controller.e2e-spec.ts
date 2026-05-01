import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/test/factories/forum/make-answer'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Choose Question Best Answer (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[PATCH] /answers/:answerId/choose-as-best', () => {
    it('should be able to choose a question best answer', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
      })

      const answerId = answer.id.toString()
      const questionId = question.id.toString()

      const response = await request(app.getHttpServer())
        .patch(`/answers/${answerId}/choose-as-best`)
        .set('Authorization', `Bearer ${accessToken}`)

      const questionOnDatabase = await prisma.question.findUnique({ where: { id: questionId } })

      expect(response.statusCode).toBe(204)
      expect(questionOnDatabase?.bestAnswerId).toEqual(answerId)
    })
  })
})
