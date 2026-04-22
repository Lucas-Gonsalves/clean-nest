import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer, type AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(overrride: Partial<AnswerProps> = {}, id?: UniqueEntityId) {
  const answer = Answer.create(
    {
      questionId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...overrride,
    },
    id,
  )

  return answer
}
