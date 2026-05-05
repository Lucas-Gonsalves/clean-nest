import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { CreateQuestionUseCase } from '@src/domain/forum/application/use-cases/create-question'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryQuestionsAttachmentsRepository } from '@/test/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/forum/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentsRepository)
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'New question',
      content: 'Question content',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0]?.id).toEqual(result.value?.question.id)
    expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toHaveLength(2)
    expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'New question',
      content: 'Question content',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryQuestionsAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('2'),
        }),
      ]),
    )
  })
})
