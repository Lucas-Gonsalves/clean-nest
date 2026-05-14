import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'

import { QuestionsRepository } from '@/src/domain/forum/application/repositories/question-repository'
import { CacheModule } from '@/src/infra/cache/cache.module'
import { CacheRepository } from '@/src/infra/cache/cache-repository'
import { AttachmentFactory } from '@/test/factories/forum/make-attachment'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { QuestionAttachmentFactory } from '@/test/factories/forum/make-question-attachment'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database.module'

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication<Server>
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let cacheRepository: CacheRepository
  let questionsRepository: QuestionsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    questionsRepository = moduleRef.get(QuestionsRepository)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Question Repository Cache', () => {
    it('should cache question details', async () => {
      const user = await studentFactory.makePrismaStudent()

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const attachment = await attachmentFactory.makePrismaAttachment()

      await questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      })

      const slug = question.slug.value

      const questionDetails = await questionsRepository.findDetailsBySlug(slug)

      const cached = await cacheRepository.get(`question:${slug}:details`)

      if (!cached) {
        throw new Error()
      }

      expect(JSON.parse(cached)).toEqual(
        expect.objectContaining({
          id: questionDetails?.questionId.toString(),
        }),
      )
    })

    it('should return cached question details on subsequent calls', async () => {
      const user = await studentFactory.makePrismaStudent()

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const attachment = await attachmentFactory.makePrismaAttachment()

      await questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      })
      const slug = question.slug.value

      let cached = await cacheRepository.get(`question:${slug}:details`)

      expect(cached).toBeNull()

      await questionsRepository.findDetailsBySlug(slug)

      cached = await cacheRepository.get(`question:${slug}:details`)

      expect(cached).not.toBeNull()

      if (!cached) {
        throw new Error()
      }

      const cachedQuestion = JSON.parse(cached)
      await cacheRepository.set(
        `question:${slug}:details`,
        JSON.stringify({
          ...cachedQuestion,
          title: 'Cached question title',
        }),
      )

      const questionDetails = await questionsRepository.findDetailsBySlug(slug)

      expect(questionDetails?.title).toEqual('Cached question title')
    })
  })

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ empty: true }))

    await questionsRepository.save(question)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()
  })
})
