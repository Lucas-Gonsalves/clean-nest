import type { AnswerAttachment } from '@src/domain/forum/enterprise/entities/answer-attachment'

export abstract class AnswersAttachmentsRepository {
  abstract createMany(attachments: AnswerAttachment[]): Promise<void>
  abstract deleteMany(attachments: AnswerAttachment[]): Promise<void>

  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
}
