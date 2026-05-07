import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/test/factories/forum/make-answer'
import { AnswerAttachmentFactory } from '@/test/factories/forum/make-answer-attachment'
import { AttachmentFactory } from '@/test/factories/forum/make-attachment'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Edit Answer (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory, AttachmentFactory, AnswerAttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[PUT] /answers/:id', () => {
    it('should be able edit a answer with valid data', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
      })

      const attachment1 = await attachmentFactory.makePrismaAttachment()
      const attachment2 = await attachmentFactory.makePrismaAttachment()
      const attachment3 = await attachmentFactory.makePrismaAttachment()

      await answerAttachmentFactory.makePrismaAnswerAttachment({
        attachmentId: attachment1.id,
        answerId: answer.id,
      })

      await answerAttachmentFactory.makePrismaAnswerAttachment({
        attachmentId: attachment2.id,
        answerId: answer.id,
      })

      const response = await request(app.getHttpServer())
        .put(`/answers/${answer.id.toString()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Edited content',
          attachments: [attachment1.id.toString(), attachment3.id.toString()],
        })

      const answerOnDatabase = await prisma.answer.findFirst({ where: { content: 'Edited content' } })
      const attachmentsOnDatabase = await prisma.attachment.findMany({
        where: {
          answerId: answerOnDatabase?.id,
        },
      })

      expect(response.statusCode).toBe(204)
      expect(answerOnDatabase).toMatchObject({
        content: 'Edited content',
      })
      expect(attachmentsOnDatabase).toHaveLength(2)
      expect(attachmentsOnDatabase).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: attachment1.id.toString(),
          }),
          expect.objectContaining({
            id: attachment3.id.toString(),
          }),
        ]),
      )
    })
  })
})
