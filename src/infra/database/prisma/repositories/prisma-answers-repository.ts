import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/src/core/events/domain-events'
import { PaginationParams } from '@/src/core/repositories/pagination-params'
import { AnswersAttachmentsRepository } from '@/src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/src/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/src/domain/forum/enterprise/entities/answer'

import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswersAttachmentsRepository,
  ) {}

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

    await Promise.all([
      this.prisma.answer.update({ where: { id: answer.id.toString() }, data }),
      this.answerAttachmentsRepository.createMany(answer.attachments.getNewItems()),
      this.answerAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems()),
    ])

    DomainEvents.dispatchEventsForAggregate(answer.id)

    return
  }

  async create(answer: Answer) {
    const data = PrismaAnswerMapper.toPersistence(answer)
    await this.prisma.answer.create({ data })

    await this.answerAttachmentsRepository.createMany(answer.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(answer.id)
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
