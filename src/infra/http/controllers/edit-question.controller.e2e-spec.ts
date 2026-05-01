import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { QuestionFactory } from '@/test/factories/forum/make-question'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Edit Question (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory

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

  describe('[PUT] /questions/:id', () => {
    it('should be able edit a new question with valid data', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id.toString() })

      const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
      })

      const response = await request(app.getHttpServer())
        .put(`/questions/${question.id.toString()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Edited Question',
          content: 'Edited content',
        })

      const questionOnDatabase = await prisma.question.findFirst({ where: { title: 'Edited Question' } })

      expect(response.statusCode).toBe(204)
      expect(questionOnDatabase).toMatchObject({
        title: 'Edited Question',
        content: 'Edited content',
      })
    })
  })
})
