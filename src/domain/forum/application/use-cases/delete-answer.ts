import { type Either, left, right } from '@src/core/either'
import { NotAllowedError } from '@src/core/errors/domain/not-allowed-error'
import { ResourceNotFoundError } from '@src/core/errors/domain/resource-not-found-error'
import type { AnswersRepository } from '@src/domain/forum/application/repositories/answers-repository'

interface DeleteAnswersUseCaseRequest {
  authorId: string
  answerId: string
}

type DeleteAnswersUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>

export class DeleteAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ authorId, answerId }: DeleteAnswersUseCaseRequest): Promise<DeleteAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findById(answerId)

    if (!answers) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answers.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answers)

    return right(null)
  }
}
