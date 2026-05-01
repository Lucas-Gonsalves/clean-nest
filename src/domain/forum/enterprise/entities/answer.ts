import { AggregateRoot } from '@src/core/entities/aggregate-root'
import type { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import type { Optional } from '@src/core/types/optional'
import { AnswerAttachmentList } from '@src/domain/forum/enterprise/entities/answer-attachment-list'
import { AnswerCreatedEvent } from '@src/domain/forum/enterprise/events/answer-created-events'

export interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Answer extends AggregateRoot<AnswerProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachment: AnswerAttachmentList) {
    this.props.attachments = attachment
    this.touch()
  }

  static create(props: Optional<AnswerProps, 'createdAt' | 'attachments'>, id?: UniqueEntityId) {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new AnswerAttachmentList(),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
