import { Injectable } from '@nestjs/common'

import { AnswersAttachmentsRepository } from '@/src/domain/forum/application/repositories/answer-attachments-repository'

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
}
