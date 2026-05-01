import { UniqueEntityId } from '@/src/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/src/domain/forum/enterprise/entities/question-attachment'
import { Attachment as PrismaAttachment } from '@/src/generated/prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        questionId: new UniqueEntityId(raw.questionId),
      },
      new UniqueEntityId(raw.id),
    )
  }
}
