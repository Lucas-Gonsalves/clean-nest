import type { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import type { DomainEvent } from '@src/core/events/domain-event'
import type { Question } from '@src/domain/forum/enterprise/entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityId

  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this.question = question
    this.bestAnswerId = bestAnswerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id
  }
}
