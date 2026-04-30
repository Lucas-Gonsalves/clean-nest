import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { QuestionComment, type QuestionCommentProps } from '@src/domain/forum/enterprise/entities/question-comment'

import { PrismaQuestionCommentMapper } from '@/src/infra/database/prisma/mappers/prisma-question-comment-mapper'
import { PrismaService } from '@/src/infra/database/prisma/prisma.service'

export function makeQuestionComment(overrride: Partial<QuestionCommentProps> = {}, id?: UniqueEntityId) {
  const questionComment = QuestionComment.create(
    {
      questionId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...overrride,
    },
    id,
  )

  return questionComment
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionCommentProps> = {}): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(data)

    await this.prisma.comment.create({ data: PrismaQuestionCommentMapper.toPersistence(questionComment) })

    return questionComment
  }
}
