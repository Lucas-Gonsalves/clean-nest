import { OnAnswerComment } from '@src/domain/notification/application/subscribers/on-answer-comment'
import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '@src/domain/notification/application/use-case/send-notification'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'

import { makeAnswer } from '@/test/factories/forum/make-answer'
import { makeAnswerComment } from '@/test/factories/forum/make-answer-comment'
import { makeQuestion } from '@/test/factories/forum/make-question'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/forum/in-memory-answer-comments-repository'
import { InMemoryAnswersAttachmentsRepository } from '@/test/repositories/forum/in-memory-answers-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/forum/in-memory-answers-repository'
import { InMemoryAttachmentsRepository } from '@/test/repositories/forum/in-memory-attachments-repository '
import { InMemoryQuestionsAttachmentsRepository } from '@/test/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/forum/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/forum/in-memory-students-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/forum/in-memory-notification-repository'
import { waitFor } from '@/test/utils/wait-for'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (data: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository)
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnAnswerComment(inMemoryAnswersRepository, inMemoryQuestionsRepository, sut)
  })
  it('should send a notification when someone comment in an answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })
    const answerComment = makeAnswerComment({
      answerId: answer.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
