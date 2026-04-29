import type { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import type { DomainEvent } from '@src/core/events/domain-event'
import type { AnswerComment } from '@src/domain/forum/enterprise/entities/answer-comment'

export class AnswerCommentEvent implements DomainEvent {
  public ocurredAt: Date
  public answerComment: AnswerComment

  constructor(answerComment: AnswerComment) {
    this.ocurredAt = new Date()
    this.answerComment = answerComment
  }

  getAggregateId(): UniqueEntityId {
    return this.answerComment.id
  }
}
