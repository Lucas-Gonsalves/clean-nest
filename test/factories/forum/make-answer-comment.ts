import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { AnswerComment, type AnswerCommentProps } from '@src/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerComment(overrride: Partial<AnswerCommentProps> = {}, id?: UniqueEntityId) {
  const answerComment = AnswerComment.create(
    {
      answerId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...overrride,
    },
    id,
  )

  return answerComment
}
