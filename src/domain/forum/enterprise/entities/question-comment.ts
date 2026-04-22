import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import type { Optional } from '@src/core/types/optional'
import { Comment, type CommentProps } from '@src/domain/forum/enterprise/entities/comment'
import { QuestionCommentEvent } from '@src/domain/forum/enterprise/events/question-comment-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(props: Optional<QuestionCommentProps, 'createdAt'>, id?: UniqueEntityId) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewQuestionComment = !id

    if (isNewQuestionComment) {
      questionComment.addDomainEvent(new QuestionCommentEvent(questionComment))
    }

    return questionComment
  }
}
