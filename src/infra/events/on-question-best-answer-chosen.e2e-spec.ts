import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { DomainEvents } from '@/src/core/events/domain-events'
import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/test/factories/forum/make-answer'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { StudentFactory } from '@/test/factories/forum/make-student'
import { waitFor } from '@/test/utils/wait-for'

import { DatabaseModule } from '../database/database.module'

describe('Choose Question Best Answer Chosen (E2E)', () => {
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

    DomainEvents.shouldRun = true

    await app.init()
  })

  describe('[PATCH] /answers/:answerId/choose-as-best', () => {
    it('should send a notification when question best answer is chosen', async () => {
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

      await request(app.getHttpServer())
        .patch(`/answers/${answerId}/choose-as-best`)
        .set('Authorization', `Bearer ${accessToken}`)

      await waitFor(async () => {
        const notificationOnDatabase = await prisma.notification.findFirst({
          where: {
            recipientId: user.id.toString(),
          },
        })
        expect(notificationOnDatabase).not.toBeNull()
      })
    })
  })
})
