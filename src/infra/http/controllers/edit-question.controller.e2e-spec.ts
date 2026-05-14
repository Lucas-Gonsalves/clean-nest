import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { AttachmentFactory } from '@/test/factories/forum/make-attachment'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { QuestionAttachmentFactory } from '@/test/factories/forum/make-question-attachment'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Edit Question (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  describe('[PUT] /questions/:id', () => {
    it('should be able edit a new question with valid data', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const attachment1 = await attachmentFactory.makePrismaAttachment()
      const attachment2 = await attachmentFactory.makePrismaAttachment()
      const attachment3 = await attachmentFactory.makePrismaAttachment()

      await questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment1.id,
        questionId: question.id,
      })

      await questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment2.id,
        questionId: question.id,
      })

      const response = await request(app.getHttpServer())
        .put(`/questions/${question.id.toString()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Edited Question',
          content: 'Edited content',
          attachments: [attachment1.id.toString(), attachment3.id.toString()],
        })

      const questionOnDatabase = await prisma.question.findFirst({ where: { title: 'Edited Question' } })
      const attachmentsOnDatabase = await prisma.attachment.findMany({
        where: {
          questionId: questionOnDatabase?.id,
        },
      })

      expect(response.statusCode).toBe(204)
      expect(questionOnDatabase).toMatchObject({
        title: 'Edited Question',
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
