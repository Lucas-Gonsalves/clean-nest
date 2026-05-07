import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'

describe('Upload Attachment (E2E)', () => {
  let app: INestApplication<Server>
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  describe('[POST] /attachments', () => {
    it('should be able upload an attachment', async () => {
      const user = await studentFactory.makePrismaStudent()

      const accessToken = jwt.sign({ sub: user.id.toString() })

      const response = await request(app.getHttpServer())
        .post('/attachments')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', './test/e2e/upload/sample-upload.jpg')

      expect(response.statusCode).toBe(201)
      expect(response.body).toMatchObject({
        attachmentId: expect.any(String),
      })
    })
  })
})
