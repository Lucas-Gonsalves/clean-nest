import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment, type AnswerAttachmentProps } from '@/domain/forum/enterprise/entities/answer-attachment'

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
