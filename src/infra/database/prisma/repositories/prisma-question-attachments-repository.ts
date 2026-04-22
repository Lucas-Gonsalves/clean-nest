import { Injectable } from '@nestjs/common'

import { QuestionsAttachmentsRepository } from '@/src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/src/domain/forum/enterprise/entities/question-attachment'

Injectable()
export class PrismaQuestionsAttachments implements QuestionsAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    throw new Error('Method not implemented.')
  }
  deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
