import { Injectable } from '@nestjs/common'

import { QuestionsAttachmentsRepository } from '@/src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/src/domain/forum/enterprise/entities/question-attachment'

import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsAttachmentsRepository implements QuestionsAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: QuestionAttachment[]) {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaQuestionAttachmentMapper.toPersistenceUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }
    const attachmentIds = attachments.map((attachment) => attachment.id.toString())

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }

  async findManyByQuestionId(questionId: string) {
    const questionsAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return questionsAttachments.map((questionAttachment) => PrismaQuestionAttachmentMapper.toDomain(questionAttachment))
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.prisma.attachment.deleteMany({ where: { questionId } })
  }
}
