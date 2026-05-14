import { DomainEvents } from '@src/core/events/domain-events'
import type { PaginationParams } from '@src/core/repositories/pagination-params'
import type { AnswerCommentsRepository } from '@src/domain/forum/application/repositories/answer-comments-repository'
import type { AnswerComment } from '@src/domain/forum/enterprise/entities/answer-comment'

import { CommentWithAuthor } from '@/src/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => student.id.equals(comment.authorId))

        if (!author) {
          throw new Error(`Author with Id "${comment.authorId.toString()}" does not exist`)
        }

        return CommentWithAuthor.create({
          content: comment.content,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })
    return answerComments
  }

  async create(answerComments: AnswerComment) {
    this.items.push(answerComments)

    DomainEvents.dispatchEventsForAggregate(answerComments.id)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex((item) => item.id === answerComment.id)

    this.items.splice(itemIndex, 1)
  }
}
