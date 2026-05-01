import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '@src/core/either'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { NotAllowedError } from '@src/core/errors/domain/not-allowed-error'
import { ResourceNotFoundError } from '@src/core/errors/domain/resource-not-found-error'
import { AnswersAttachmentsRepository } from '@src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@src/domain/forum/application/repositories/answers-repository'
import type { Answer } from '@src/domain/forum/enterprise/entities/answer'
import { AnswerAttachment } from '@src/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '@src/domain/forum/enterprise/entities/answer-attachment-list'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentRepository: AnswersAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments = await this.answerAttachmentRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answerRepository.save(answer)

    return right({ answer })
  }
}
