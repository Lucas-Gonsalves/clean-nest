import { AnswerComment } from '@/src/domain/forum/enterprise/entities/answer-comment'

export class AnswerCommentPresenter {
  static toHTTP(answercomment: AnswerComment) {
    return {
      id: answercomment.id.toString(),
      content: answercomment.content,
      createdAt: answercomment.createdAt,
      updatedAt: answercomment.updatedAt,
    }
  }
}
