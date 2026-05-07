import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { DeleteQuestionCommentUseCase } from '@src/domain/forum/application/use-cases/delete-question-comment'
import { beforeEach, describe, expect, it } from 'vitest'

import { makeQuestionComment } from '@/test/factories/forum/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/forum/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/forum/in-memory-students-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository)

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)
  })
})
