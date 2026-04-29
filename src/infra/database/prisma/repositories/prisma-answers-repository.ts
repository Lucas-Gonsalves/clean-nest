import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/src/core/repositories/pagination-params'
import { AnswersRepository } from '@/src/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/src/domain/forum/enterprise/entities/answer'

import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id } })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async save(answer: Answer) {
    const data = PrismaAnswerMapper.toPersistence(answer)
    await this.prisma.answer.update({ where: { id: answer.id.toString() }, data })
    return
  }

  async create(answer: Answer) {
    const data = PrismaAnswerMapper.toPersistence(answer)
    await this.prisma.answer.create({ data })
    return
  }

  async delete(answer: Answer) {
    await this.prisma.answer.delete({ where: { id: answer.id.toString() } })
    return
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map((answer) => PrismaAnswerMapper.toDomain(answer))
  }
}
