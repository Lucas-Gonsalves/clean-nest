import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswersAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaQuestionsAttachments } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'

@Module({
  providers: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsAttachments,
    PrismaAnswerCommentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsAttachments,
    PrismaAnswerCommentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersAttachmentsRepository,
  ],
})
export class DatabaseModule {}
