import { Injectable } from '@nestjs/common'
import { type Either, right } from '@src/core/either'
import { AnswerCommentsRepository } from '@src/domain/forum/application/repositories/answer-comments-repository'
import type { AnswerComment } from '@src/domain/forum/enterprise/entities/answer-comment'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({ answerId, page }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
      page,
    })

    return right({ answerComments })
  }
}
