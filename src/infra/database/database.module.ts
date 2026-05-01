import { Module } from '@nestjs/common'

import { AnswersAttachmentsRepository } from '@/src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '@/src/domain/forum/application/repositories/answer-comments-repository'
import { AnswersRepository } from '@/src/domain/forum/application/repositories/answers-repository'
import { QuestionsAttachmentsRepository } from '@/src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentsRepository } from '@/src/domain/forum/application/repositories/question-comments-repository'
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
  ],
})
export class DatabaseModule {}
