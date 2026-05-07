import { OnQuestionBestAnswerChoosen } from '@src/domain/notification/application/subscribers/on-question-best-answer-chosen'
import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '@src/domain/notification/application/use-case/send-notification'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'

import { makeAnswer } from '@/test/factories/forum/make-answer'
import { makeQuestion } from '@/test/factories/forum/make-question'
import { InMemoryAnswersAttachmentsRepository } from '@/test/repositories/forum/in-memory-answers-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/forum/in-memory-answers-repository'
import { InMemoryAttachmentsRepository } from '@/test/repositories/forum/in-memory-attachments-repository '
import { InMemoryQuestionsAttachmentsRepository } from '@/test/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/forum/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/forum/in-memory-students-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/notification/in-memory-notification-repository'
import { waitFor } from '@/test/utils/wait-for'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sut: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (data: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository()
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnQuestionBestAnswerChoosen(inMemoryAnswersRepository, sut)
  })

  it('should send a notification when question has new best chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id
    await inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
