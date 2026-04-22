import { OnQuestionComment } from '@src/domain/notification/application/subscribers/on-question-comment'
import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '@src/domain/notification/application/use-case/send-notification'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'

import { makeQuestion } from '@/test/factories/forum/make-question'
import { makeQuestionComment } from '@/test/factories/forum/make-question-comment'
import { InMemoryQuestionsAttachmentsRepository } from '@/test/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/forum/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/forum/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/notification/in-memory-notification-repository'
import { waitFor } from '@/test/utils/wait-for'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (data: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnQuestionComment(inMemoryQuestionsRepository, sut)
  })
  it('should send a notification when someone comment in an question', async () => {
    const question = makeQuestion()

    const questionComment = makeQuestionComment({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
