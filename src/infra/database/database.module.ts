import { Module } from '@nestjs/common'

import { AnswersAttachmentsRepository } from '@/src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '@/src/domain/forum/application/repositories/answer-comments-repository'
import { AnswersRepository } from '@/src/domain/forum/application/repositories/answers-repository'
import { AttachmentsRepository } from '@/src/domain/forum/application/repositories/attachments-repository'
import { QuestionsAttachmentsRepository } from '@/src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentsRepository } from '@/src/domain/forum/application/repositories/question-comments-repository'
import { QuestionsRepository } from '@/src/domain/forum/application/repositories/question-repository'
import { StudentsRepository } from '@/src/domain/forum/application/repositories/students-repository'
import { NotificationsRepository } from '@/src/domain/notification/application/repositories/notifications-repository'
import { EnvModule } from '@/src/infra/env/env.module'

import { CacheModule } from '../cache/cache.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswersAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaQuestionsAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
  imports: [EnvModule, CacheModule],
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionsAttachmentsRepository,
      useClass: PrismaQuestionsAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswersAttachmentsRepository,
      useClass: PrismaAnswersAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    QuestionCommentsRepository,
    QuestionsAttachmentsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswersAttachmentsRepository,
    StudentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
