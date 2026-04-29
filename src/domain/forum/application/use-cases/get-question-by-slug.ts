import { type Either, left, right } from '@src/core/either'
import { ResourceNotFoundError } from '@src/core/errors/domain/resource-not-found-error'
import type { QuestionsRepository } from '@src/domain/forum/application/repositories/question-repository'
import { Question } from '@src/domain/forum/enterprise/entities/question'
interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({
      question,
    })
  }
}
