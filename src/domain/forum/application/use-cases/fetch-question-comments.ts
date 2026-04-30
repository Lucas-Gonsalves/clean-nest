import { Injectable } from '@nestjs/common'
import { type Either, right } from '@src/core/either'
import { QuestionCommentsRepository } from '@src/domain/forum/application/repositories/question-comments-repository'
import type { QuestionComment } from '@src/domain/forum/enterprise/entities/question-comment'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page })

    return right({ questionComments })
  }
}
