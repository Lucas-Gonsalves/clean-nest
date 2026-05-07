import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { Slug } from '@/src/domain/forum/enterprise/entities/value-objects/slug'
import { AttachmentFactory } from '@/test/factories/forum/make-attachment'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { QuestionAttachmentFactory } from '@/test/factories/forum/make-question-attachment'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Get Question By Slug (E2E)', () => {
  let app: INestApplication<Server>
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })

  describe('[GET] /questions/:slug', () => {
    it('should be able to get a question by slug', async () => {
      const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 01',
        slug: Slug.create('question-01'),
      })

      const attachment = await attachmentFactory.makePrismaAttachment({
        title: 'Some Attachment',
      })

      await questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      })

      const response = await request(app.getHttpServer())
        .get('/questions/question-01')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        question: expect.objectContaining({
          title: 'Question 01',
          author: 'John Doe',
          attachments: expect.arrayContaining([
            expect.objectContaining({
              title: 'Some Attachment',
            }),
          ]),
        }),
      })
    })
  })
})
