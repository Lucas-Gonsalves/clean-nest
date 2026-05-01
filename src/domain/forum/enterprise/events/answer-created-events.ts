import type { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import type { DomainEvent } from '@src/core/events/domain-event'
import type { Answer } from '@src/domain/forum/enterprise/entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.answer = answer
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.answer.id
  }
}
