import { InMemoryAnswersAttachmentsRepository } from '@test/repositories/forum/in-memory-answers-attachments-repository'
import { InMemoryAnswersRepository } from '@test/repositories/forum/in-memory-answers-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('should be able to create a new answer', async () => {
    const result = await sut.execute({
      instructorId: '',
      questionId: '',
      content: 'Answer content',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerRepository.items[0]?.id).toEqual(result.value?.answer.id)
    expect(inMemoryAnswerRepository.items[0]?.attachments.currentItems).toHaveLength(2)
    expect(inMemoryAnswerRepository.items[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
