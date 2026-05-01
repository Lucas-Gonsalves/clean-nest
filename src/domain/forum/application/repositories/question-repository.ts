import type { PaginationParams } from '@src/core/repositories/pagination-params'
import type { Question } from '@src/domain/forum/enterprise/entities/question'

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract delete(question: Question): Promise<void>
}
