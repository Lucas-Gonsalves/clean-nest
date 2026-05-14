import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/src/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/src/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/src/domain/forum/enterprise/entities/answer-comment'

import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({ where: { id } })

    if (!answerComment) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answersComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answersComments.map((answerComment) => PrismaAnswerCommentMapper.toDomain(answerComment))
  }

  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams) {
    const answeComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answeComments.map((questionComment) => PrismaCommentWithAuthorMapper.toDomain(questionComment))
  }

  async create(answerComment: AnswerComment) {
    const data = PrismaAnswerCommentMapper.toPersistence(answerComment)
    await this.prisma.comment.create({ data })
    return
  }

  async delete(answerComment: AnswerComment) {
    await this.prisma.comment.delete({ where: { id: answerComment.id.toString() } })
    return
  }
}
