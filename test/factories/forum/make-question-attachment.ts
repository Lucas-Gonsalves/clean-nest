import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  type QuestionAttachmentProps,
} from '@src/domain/forum/enterprise/entities/question-attachment'

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
