import { QuestionComment } from '@/src/domain/forum/enterprise/entities/question-comment'

export class QuestionCommentPresenter {
  static toHTTP(questioncomment: QuestionComment) {
    return {
      id: questioncomment.id.toString(),
      content: questioncomment.content,
      createdAt: questioncomment.createdAt,
      updatedAt: questioncomment.updatedAt,
    }
  }
}
