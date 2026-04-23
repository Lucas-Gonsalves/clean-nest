import { Module } from '@nestjs/common'

import { QuestionsRepository } from '@/src/domain/forum/application/repositories/question-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswersAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionsAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
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
  ],
})
export class DatabaseModule {}
