import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { AnswerFactory } from '@/test/factories/forum/make-answer'
import { AnswerCommentFactory } from '@/test/factories/forum/make-answer-comment'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Fetch Answer Comment (E2E)', () => {
  let app: INestApplication<Server>
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, AnswerCommentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[GET] /answers', () => {
    it('should be able to fetch the answer comment', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id })

      const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

      const answer = await answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id })
      const answerId = answer.id.toString()

      await answerCommentFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
        content: 'Answer Comment 1',
      })

      await answerCommentFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
        content: 'Answer Comment 2',
      })

      const response = await request(app.getHttpServer())
        .get(`/answers/${answerId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        answers: expect.arrayContaining([
          expect.objectContaining({ content: 'Answer Comment 1' }),
          expect.objectContaining({ content: 'Answer Comment 2' }),
        ]),
      })
    })
  })
})
