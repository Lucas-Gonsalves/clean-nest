import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { QuestionFactory } from '@/test/factories/forum/make-question'
import { QuestionCommentFactory } from '@/test/factories/forum/make-question-comment'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Fetch Question Comment (E2E)', () => {
  let app: INestApplication<Server>
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[GET] /questions/:questionId/comments', () => {
    it('should be able to fetch the question comment', async () => {
      const user = await studentFactory.makePrismaStudent({
        name: 'John Doe',
      })

      const accessToken = jwt.sign({ sub: user.id })

      const question = await questionFactory.makePrismaQuestion({ authorId: user.id, title: 'Question 01' })
      const questionId = question.id.toString()

      await questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Question Comment 1',
      })

      await questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Question Comment 2',
      })

      const response = await request(app.getHttpServer())
        .get(`/questions/${questionId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        comments: expect.arrayContaining([
          expect.objectContaining({ content: 'Question Comment 1', authorName: 'John Doe' }),
          expect.objectContaining({ content: 'Question Comment 2', authorName: 'John Doe' }),
        ]),
      })
    })
  })
})
