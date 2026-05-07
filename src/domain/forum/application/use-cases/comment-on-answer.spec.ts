import { CommentOnAnswerUseCase } from '@src/domain/forum/application/use-cases/comment-on-answer'
import { beforeEach, describe, expect, it } from 'vitest'

import { makeAnswer } from '@/test/factories/forum/make-answer'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/forum/in-memory-answer-comments-repository'
import { InMemoryAnswersAttachmentsRepository } from '@/test/repositories/forum/in-memory-answers-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/forum/in-memory-answers-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/forum/in-memory-students-repository'

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository)

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
