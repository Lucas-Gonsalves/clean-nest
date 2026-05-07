import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '@src/core/either'
import { ResourceNotFoundError } from '@src/core/errors/domain/resource-not-found-error'
import { QuestionsRepository } from '@src/domain/forum/application/repositories/question-repository'

import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'
interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails
  }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({
      question,
    })
  }
}
