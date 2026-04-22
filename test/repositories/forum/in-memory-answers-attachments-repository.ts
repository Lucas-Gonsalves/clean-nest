import type { AnswersAttachmentsRepository } from '@src/domain/forum/application/repositories/answer-attachments-repository'
import type { AnswerAttachment } from '@src/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswersAttachmentsRepository implements AnswersAttachmentsRepository {
  public items: AnswerAttachment[] = []

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter((attachment) => attachment.answerId.toString() !== answerId)

    this.items = answerAttachments
  }

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter((item) => item.answerId.toString() === answerId)

    return answerAttachments
  }
}
