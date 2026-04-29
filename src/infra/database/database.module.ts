import { Module } from '@nestjs/common'

import { QuestionsRepository } from '@/src/domain/forum/application/repositories/question-repository'
import { StudentsRepository } from '@/src/domain/forum/application/repositories/students-repository'
import { EnvModule } from '@/src/infra/env/env.module'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswersAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionsAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
  imports: [EnvModule],
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
    PrismaQuestionCommentsRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersAttachmentsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
