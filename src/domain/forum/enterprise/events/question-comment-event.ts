import type { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import type { DomainEvent } from '@src/core/events/domain-event'
import type { QuestionComment } from '@src/domain/forum/enterprise/entities/question-comment'

export class QuestionCommentEvent implements DomainEvent {
  public ocurredAt: Date
  public questionComment: QuestionComment

  constructor(questionComment: QuestionComment) {
    this.ocurredAt = new Date()
    this.questionComment = questionComment
  }

  getAggregateId(): UniqueEntityId {
    return this.questionComment.id
  }
}
