import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { QuestionCommentFactory } from '@/test/factories/forum/make-question-comment'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Delete Question Comment (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let questionCommentFactory: QuestionCommentFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[DELETE] /questions/comments/:id', () => {
    it('should be able to delete question comment', async () => {
      const user = await studentFactory.makePrismaStudent()
      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const questionComment = await questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
      })

      const questionCommentId = questionComment.id.toString()

      const response = await request(app.getHttpServer())
        .delete(`/questions/comments/${questionCommentId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      const commentOnDatabase = await prisma.comment.findUnique({ where: { id: questionCommentId } })

      expect(response.statusCode).toBe(204)
      expect(commentOnDatabase).toBeNull()
    })
  })
})
