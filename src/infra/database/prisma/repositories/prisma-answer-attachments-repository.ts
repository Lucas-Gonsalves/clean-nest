import { Injectable } from '@nestjs/common'

import { AnswersAttachmentsRepository } from '@/src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/src/domain/forum/enterprise/entities/answer-attachment'

@Injectable()
export class PrismaAnswersAttachmentsRepository implements AnswersAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error('Method not implemented.')
  }
  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
