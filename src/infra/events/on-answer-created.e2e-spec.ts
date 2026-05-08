import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { StudentFactory } from '@/test/factories/forum/make-student'
import { waitFor } from '@/test/utils/wait-for'

import { DatabaseModule } from '../database/database.module'

describe('On Answer Created (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[POST] /question/:questionId/answers', () => {
    it('should send a notification when answer is created', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({ authorId: user.id, title: 'Question 01' })

      await request(app.getHttpServer())
        .post(`/questions/${question.id.toString()}/answers`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Content',
          attachments: [],
        })

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
