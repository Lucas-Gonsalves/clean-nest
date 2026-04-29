import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import type { Optional } from '@src/core/types/optional'
import { Comment, type CommentProps } from '@src/domain/forum/enterprise/entities/comment'
import { AnswerCommentEvent } from '@src/domain/forum/enterprise/events/answer-comment-event'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: UniqueEntityId) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswerComment = !id

    if (isNewAnswerComment) {
      answerComment.addDomainEvent(new AnswerCommentEvent(answerComment))
    }

    return answerComment
  }
}
