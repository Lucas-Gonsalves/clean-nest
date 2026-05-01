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

describe('Comment On Answer (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory

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

  describe('[POST] /answers/:answerId/comments', () => {
    it('should be able to comment in a answer', async () => {
      const user = await studentFactory.makePrismaStudent()
      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

      const answer = await answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id })

      const answerId = answer.id.toString()

      const response = await request(app.getHttpServer())
        .post(`/answers/${answerId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'New comment',
        })

      const commentOnDatabase = await prisma.comment.findFirst({
        where: { content: 'New comment' },
      })

      expect(response.statusCode).toBe(201)
      expect(commentOnDatabase).toMatchObject({
        content: 'New comment',
      })
    })
  })
})
