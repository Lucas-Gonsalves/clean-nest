import { Injectable } from '@nestjs/common'
import { type Either, right } from '@src/core/either'
import { QuestionsRepository } from '@src/domain/forum/application/repositories/question-repository'
import { Question } from '@src/domain/forum/enterprise/entities/question'

interface FetchRecentTopicsUseCaseRequest {
  page: number
}

type FetchRecentTopicsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

@Injectable()
export class FetchRecentTopicsUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({ page }: FetchRecentTopicsUseCaseRequest): Promise<FetchRecentTopicsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return right({ questions })
  }
}
