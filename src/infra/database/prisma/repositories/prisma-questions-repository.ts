import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/src/core/repositories/pagination-params'
import { QuestionsRepository } from '@/src/domain/forum/application/repositories/question-repository'
import { Question } from '@/src/domain/forum/enterprise/entities/question'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  async findById(id: string): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }
  async create(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async save(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async findBySlug(slug: string): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }
  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.')
  }
  async delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
