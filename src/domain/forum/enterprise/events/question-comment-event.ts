import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

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
