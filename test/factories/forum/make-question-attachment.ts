import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  type QuestionAttachmentProps,
} from '@src/domain/forum/enterprise/entities/question-attachment'

import { PrismaService } from '@/src/infra/database/prisma/prisma.service'

export function makeQuestionAttachment(overrride: Partial<QuestionAttachmentProps> = {}, id?: UniqueEntityId) {
  const questionAttachment = QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...overrride,
    },
    id,
  )

  return questionAttachment
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(data: Partial<QuestionAttachmentProps> = {}): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data)
    await this.prisma.attachment.updateMany({
      where: {
        id: questionAttachment.id.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    })

    return questionAttachment
  }
}
