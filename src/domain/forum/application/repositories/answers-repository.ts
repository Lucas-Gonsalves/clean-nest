import type { PaginationParams } from '@src/core/repositories/pagination-params'
import type { Answer } from '@src/domain/forum/enterprise/entities/answer'

export abstract class AnswersRepository {
  abstract findById(id: string): Promise<Answer | null>
  abstract save(answer: Answer): Promise<void>
  abstract create(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
  abstract findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
}
