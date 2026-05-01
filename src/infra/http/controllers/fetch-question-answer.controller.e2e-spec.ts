import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { AnswerFactory } from '@/test/factories/forum/make-answer'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Fetch Question Answers (E2E)', () => {
  let app: INestApplication<Server>
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

    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[GET] /questions/:questionId/answers', () => {
    it('should be able fetch answers by a question', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
        content: 'first answer',
      })

      await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
        content: 'second answer',
      })

      const response = await request(app.getHttpServer())
        .get(`/questions/${question.id.toString()}/answers`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ page: '1' })

      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        answers: expect.arrayContaining([
          expect.objectContaining({ content: 'first answer' }),
          expect.objectContaining({ content: 'second answer' }),
        ]),
      })
    })
  })
})
