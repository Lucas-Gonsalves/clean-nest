import { CommentOnQuestionUseCase } from '@src/domain/forum/application/use-cases/comment-on-question'
import { beforeEach, describe, expect, it } from 'vitest'

import { makeQuestion } from '@/test/factories/forum/make-question'
import { InMemoryQuestionsAttachmentsRepository } from '@/test/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/forum/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/forum/in-memory-questions-repository'

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionsAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentsRepository)
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository)
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Test comment',
    })

    expect(inMemoryQuestionCommentsRepository.items[0]?.content).toEqual('Test comment')
  })
})
