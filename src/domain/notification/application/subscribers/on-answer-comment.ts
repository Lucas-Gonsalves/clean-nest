import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@src/core/events/domain-events'
import { EventHandler } from '@src/core/events/event-handler'
import { AnswersRepository } from '@src/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '@src/domain/forum/application/repositories/question-repository'
import { AnswerCommentEvent } from '@src/domain/forum/enterprise/events/answer-comment-event'
import { SendNotificationUseCase } from '@src/domain/notification/application/use-case/send-notification'

@Injectable()
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
