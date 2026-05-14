import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/src/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/src/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/src/domain/forum/enterprise/entities/question-comment'

import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const questionComment = await this.prisma.comment.findUnique({ where: { id } })

    if (!questionComment) {
      return null
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionsComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questionsComments.map((questionComment) => PrismaQuestionCommentMapper.toDomain(questionComment))
  }

  async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams) {
    const questionsComments = await this.prisma.comment.findMany({
      where: {
        questionId,
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

    return questionsComments.map((questionComment) => PrismaCommentWithAuthorMapper.toDomain(questionComment))
  }

  async create(questionComment: QuestionComment) {
    const data = PrismaQuestionCommentMapper.toPersistence(questionComment)
    await this.prisma.comment.create({ data })
    return
  }

  async delete(questionComment: QuestionComment) {
    await this.prisma.comment.delete({ where: { id: questionComment.id.toString() } })
    return
  }
}
