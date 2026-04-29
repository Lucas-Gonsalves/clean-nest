import { type Either, left, right } from '@src/core/either'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@src/core/errors/domain/resource-not-found-error'
import type { QuestionCommentsRepository } from '@src/domain/forum/application/repositories/question-comments-repository'
import type { QuestionsRepository } from '@src/domain/forum/application/repositories/question-repository'
import { QuestionComment } from '@src/domain/forum/enterprise/entities/question-comment'

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({ questionComment })
  }
}
