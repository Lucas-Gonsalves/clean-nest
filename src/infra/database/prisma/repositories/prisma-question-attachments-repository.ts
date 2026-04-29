import { Injectable } from '@nestjs/common'

import { QuestionsAttachmentsRepository } from '@/src/domain/forum/application/repositories/question-attachments-repository'

import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { PrismaService } from '../prisma.service'

Injectable()
export class PrismaQuestionsAttachmentsRepository implements QuestionsAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(questionId: string) {
    const questionsAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return questionsAttachments.map((questionAttachment) => PrismaQuestionAttachmentMapper.toDomain(questionAttachment))
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.prisma.attachment.deleteMany({ where: { id: questionId } })
  }
}
