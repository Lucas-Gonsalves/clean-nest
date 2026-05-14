import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { AnswerAttachment, type AnswerAttachmentProps } from '@src/domain/forum/enterprise/entities/answer-attachment'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'

export function makeAnswerAttachment(overrride: Partial<AnswerAttachmentProps> = {}, id?: UniqueEntityId) {
  const answerAttachment = AnswerAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...overrride,
    },
    id,
  )

  return answerAttachment
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(data: Partial<AnswerAttachmentProps> = {}): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data)
    await this.prisma.attachment.updateMany({
      where: {
        id: answerAttachment.id.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    })

    return answerAttachment
  }
}
