import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/src/core/events/domain-events'
import { PaginationParams } from '@/src/core/repositories/pagination-params'
import { QuestionsAttachmentsRepository } from '@/src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/src/domain/forum/application/repositories/question-repository'
import { Question } from '@/src/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/src/domain/forum/enterprise/entities/value-objects/question-details'
import { CacheRepository } from '@/src/infra/cache/cache-repository'

import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionsAttachmentsRepository,
    private cacheRepository: CacheRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { id } })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question)
    await this.prisma.question.create({ data })

    await this.questionAttachmentsRepository.createMany(question.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(question.id)

    return
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question)

    await Promise.all([
      this.prisma.question.update({ where: { id: question.id.toString() }, data }),
      this.questionAttachmentsRepository.createMany(question.attachments.getNewItems()),
      this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems()),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
    await this.cacheRepository.delete(`question:${data.slug}:details`)
    return
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { slug } })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheKey = `question:${slug}:details`
    const cacheHit = await this.cacheRepository.get(cacheKey)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return PrismaQuestionDetailsMapper.toDomain(cacheData)
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: { author: true, attachments: true },
    })

    if (!question) {
      return null
    }

    await this.cacheRepository.set(cacheKey, JSON.stringify(question))

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    return questionDetails
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map((question) => PrismaQuestionMapper.toDomain(question))
  }
  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({ where: { id: question.id.toString() } })
    return
  }
}
