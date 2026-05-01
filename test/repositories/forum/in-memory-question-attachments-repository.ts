import type { QuestionsAttachmentsRepository } from '@src/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionAttachment } from '@src/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionsAttachmentsRepository implements QuestionsAttachmentsRepository {
  public items: QuestionAttachment[] = []

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter((attachment) => attachment.questionId.toString() !== questionId)

    this.items = questionAttachments
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter((item) => item.questionId.toString() === questionId)

    return questionAttachments
  }
}
