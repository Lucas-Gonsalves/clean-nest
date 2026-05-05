import type { QuestionsAttachmentsRepository } from '@src/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionAttachment } from '@src/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionsAttachmentsRepository implements QuestionsAttachmentsRepository {
  public items: QuestionAttachment[] = []

  async createMany(attachments: QuestionAttachment[]) {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter((attachment) => attachment.questionId.toString() !== questionId)

    this.items = questionAttachments
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter((item) => item.questionId.toString() === questionId)

    return questionAttachments
  }
}
