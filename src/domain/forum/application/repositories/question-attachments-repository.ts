import type { QuestionAttachment } from '@src/domain/forum/enterprise/entities/question-attachment'

export abstract class QuestionsAttachmentsRepository {
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>

  abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
}
