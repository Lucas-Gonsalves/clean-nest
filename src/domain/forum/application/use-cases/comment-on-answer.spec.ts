import { makeAnswer } from '@test/factories/forum/make-answer'
import { InMemoryAnswerCommentsRepository } from '@test/repositories/forum/in-memory-answer-comments-repository'
import { InMemoryAnswersAttachmentsRepository } from '@test/repositories/forum/in-memory-answers-attachments-repository'
import { InMemoryAnswersRepository } from '@test/repositories/forum/in-memory-answers-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository)
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Test comment',
    })

    expect(inMemoryAnswerCommentsRepository.items[0]?.content).toEqual('Test comment')
  })
})
