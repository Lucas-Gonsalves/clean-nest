import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { Answer, type AnswerProps } from '@src/domain/forum/enterprise/entities/answer'

import { PrismaAnswerMapper } from '@/src/infra/database/prisma/mappers/prisma-answer-mapper'
import { PrismaService } from '@/src/infra/database/prisma/prisma.service'

export function makeAnswer(overrride: Partial<AnswerProps> = {}, id?: UniqueEntityId) {
  const answer = Answer.create(
    {
      questionId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...overrride,
    },
    id,
  )

  return answer
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)

    await this.prisma.answer.create({ data: PrismaAnswerMapper.toPersistence(answer) })

    return answer
  }
}
