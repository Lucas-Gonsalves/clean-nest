import { makeAnswer } from '@test/factories/forum/make-answer'
import { makeQuestion } from '@test/factories/forum/make-question'
import { InMemoryAnswersAttachmentsRepository } from '@test/repositories/forum/in-memory-answers-attachments-repository'
import { InMemoryAnswersRepository } from '@test/repositories/forum/in-memory-answers-repository'
import { InMemoryQuestionsAttachmentsRepository } from '@test/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@test/repositories/forum/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from '@test/repositories/notification/in-memory-notification-repository'
import { waitFor } from '@test/utils/wait-for'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'

import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '@/domain/notification/application/use-case/send-notification'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (data: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnAnswerCreated(inMemoryQuestionsRepository, sut)
  })
  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
