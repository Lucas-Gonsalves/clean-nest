import { Injectable } from '@nestjs/common'

import { AnswersAttachmentsRepository } from '@/src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/src/domain/forum/enterprise/entities/answer-attachment'

import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswersAttachmentsRepository implements AnswersAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string) {
    const answersAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return answersAttachments.map((answerAttachment) => PrismaAnswerAttachmentMapper.toDomain(answerAttachment))
  }

  async deleteManyByAnswerId(answerId: string) {
    await this.prisma.attachment.deleteMany({ where: { answerId } })
  }

  async createMany(attachments: AnswerAttachment[]) {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaAnswerAttachmentMapper.toPersistenceUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
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
}
