import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/test/factories/forum/make-answer'
import { AnswerCommentFactory } from '@/test/factories/forum/make-answer-comment'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Delete Answer Comment (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let answerFactory: AnswerFactory
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerCommentFactory: AnswerCommentFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, AnswerCommentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[DELETE] /answers/comments/:id', () => {
    it('should be able to delete answer comment', async () => {
      const user = await studentFactory.makePrismaStudent()
      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

      const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
      })

      const answerComment = await answerCommentFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
      })

      const answerCommentId = answerComment.id.toString()

      const response = await request(app.getHttpServer())
        .delete(`/answers/comments/${answerCommentId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      const commentOnDatabase = await prisma.comment.findUnique({ where: { id: answerCommentId } })

      expect(response.statusCode).toBe(204)
      expect(commentOnDatabase).toBeNull()
    })
  })
})
