import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/src/core/entities/unique-entity-id'

import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/src/infra/database/prisma/prisma.service'
import { PrismaAnswerMapper } from '@/src/infra/database/prisma/mappers/prisma-answer-mapper'
import { Answer, AnswerProps } from '@/src/domain/forum/enterprise/entities/answer'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
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

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPersistence(answer),
    })

    return answer
  }
}