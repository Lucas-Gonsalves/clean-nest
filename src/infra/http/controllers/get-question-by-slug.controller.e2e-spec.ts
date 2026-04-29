import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { Slug } from '@/src/domain/forum/enterprise/entities/value-objects/slug'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Get Question By Slug (E2E)', () => {
  let app: INestApplication<Server>
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  describe('[GET] /questions/:slug', () => {
    it('should be able to get a question by slug', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id.toString() })

      await questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 01',
        slug: Slug.create('question-01'),
      })

      const response = await request(app.getHttpServer())
        .get('/questions/question-01')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        question: expect.objectContaining({ title: 'Question 01' }),
      })
    })
  })
})
