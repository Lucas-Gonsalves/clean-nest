import { FetchRecentTopicsUseCase } from '@src/domain/forum/application/use-cases/fetch-recent-topics'
import { beforeEach, describe, expect, it } from 'vitest'

import { makeQuestion } from '@/test/factories/forum/make-question'
import { InMemoryAttachmentsRepository } from '@/test/repositories/forum/in-memory-attachments-repository '
import { InMemoryQuestionsAttachmentsRepository } from '@/test/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/forum/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/forum/in-memory-students-repository'

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchRecentTopicsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )

    sut = new FetchRecentTopicsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2026, 3, 2) }))
    await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2026, 3, 3) }))
    await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2026, 3, 1) }))

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toHaveLength(3)
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2026, 3, 3) }),
      expect.objectContaining({ createdAt: new Date(2026, 3, 2) }),
      expect.objectContaining({ createdAt: new Date(2026, 3, 1) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2026, 3, 1) }))
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})
