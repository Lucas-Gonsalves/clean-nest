import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { AnswerComment, type AnswerCommentProps } from '@src/domain/forum/enterprise/entities/answer-comment'

import { PrismaAnswerCommentMapper } from '@/src/infra/database/prisma/mappers/prisma-answer-comment-mapper'
import { PrismaService } from '@/src/infra/database/prisma/prisma.service'

export function makeAnswerComment(overrride: Partial<AnswerCommentProps> = {}, id?: UniqueEntityId) {
  const answerComment = AnswerComment.create(
    {
      answerId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...overrride,
    },
    id,
  )

  return answerComment
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(data: Partial<AnswerCommentProps> = {}): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data)

    await this.prisma.comment.create({ data: PrismaAnswerCommentMapper.toPersistence(answerComment) })

    return answerComment
  }
}
