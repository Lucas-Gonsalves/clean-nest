import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { Question, type QuestionProps } from '@src/domain/forum/enterprise/entities/question'

import { PrismaQuestionMapper } from '@/src/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/src/infra/database/prisma/prisma.service'

export function makeQuestion(overrride: Partial<QuestionProps> = {}, id?: UniqueEntityId) {
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...overrride,
    },
    id,
  )

  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps> = {}): Promise<Question> {
    const question = makeQuestion(data)

    await this.prisma.question.create({ data: PrismaQuestionMapper.toPersistence(question) })

    return question
  }
}
