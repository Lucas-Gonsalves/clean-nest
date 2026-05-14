import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@src/core/events/domain-events'
import { EventHandler } from '@src/core/events/event-handler'
import { AnswersRepository } from '@src/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@src/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { SendNotificationUseCase } from '@src/domain/notification/application/use-case/send-notification'

@Injectable()
export class OnQuestionBestAnswerChoosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendQuestionBestAnswerNotification.bind(this), QuestionBestAnswerChosenEvent.name)
  }

  private async sendQuestionBestAnswerNotification({ question, bestAnswerId }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(bestAnswerId.toString())

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer?.authorId.toString(),
        title: 'Your answer was chosen',
        content: `The answer that you send in "${question.title.substring(0, 20).concat('...')}" was chosen by the author!`,
      })
    }
  }
}
