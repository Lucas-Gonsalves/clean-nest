import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/infra/app.module'
import { Server } from 'http'
import request from 'supertest'

import { NotificationFactory } from '@/test/factories/forum/make-notification'
import { StudentFactory } from '@/test/factories/forum/make-student'

import { DatabaseModule } from '../../database/database.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Read Notification (E2E)', () => {
  let app: INestApplication<Server>
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  describe('[PATCH] /notification/:notificationId/read', () => {
    it('should be able to read a notification', async () => {
      const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

      const accessToken = jwt.sign({ sub: user.id.toString() })

      const notification = await notificationFactory.makePrismaNotification({
        recipientId: user.id,
      })

      const notificationId = notification.id.toString()

      const response = await request(app.getHttpServer())
        .patch(`/notification/${notificationId}/read`)
        .set('Authorization', `Bearer ${accessToken}`)

      const notificationOnDatabase = await prisma.notification.findFirst({
        where: { recipientId: user.id.toString() },
      })

      expect(response.statusCode).toBe(204)
      expect(notificationOnDatabase?.readAt).not.toBeNull()
    })
  })
})
