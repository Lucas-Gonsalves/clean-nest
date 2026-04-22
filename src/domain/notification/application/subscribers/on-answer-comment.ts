import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { AnswerCommentEvent } from '@/domain/forum/enterprise/events/answer-comment-event'
import type { SendNotificationUseCase } from '@/domain/notification/application/use-case/send-notification'

export class OnAnswerComment implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private questionRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendAnswerNotification.bind(this), AnswerCommentEvent.name)
  }

  private async sendAnswerNotification({ answerComment }: AnswerCommentEvent) {
    const answer = await this.answersRepository.findById(answerComment.answerId.toString())

    if (!answer) {
      return
    }

    const question = await this.questionRepository.findById(answer.questionId.toString())

    if (!question) {
      return
    }

    await this.sendNotificationUseCase.execute({
      recipientId: answer?.authorId.toString(),
      title: 'Someone commented on your answer!',
      content: `New comment on your answer: ${answerComment.content.substring(0, 20).concat('...')}`,
    })
  }
}
