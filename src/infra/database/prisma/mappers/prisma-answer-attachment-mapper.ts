import { UniqueEntityId } from '@/src/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/src/domain/forum/enterprise/entities/answer-attachment'
import { Attachment as PrismaAttachment } from '@/src/generated/prisma/client'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type')
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        answerId: new UniqueEntityId(raw.answerId),
      },
      new UniqueEntityId(raw.id),
    )
  }
}
