import { DomainEvents } from '@src/core/events/domain-events'
import type { EventHandler } from '@src/core/events/event-handler'
import type { QuestionsRepository } from '@src/domain/forum/application/repositories/question-repository'
import { AnswerCreatedEvent } from '@src/domain/forum/enterprise/events/answer-created-events'
import type { SendNotificationUseCase } from '@src/domain/notification/application/use-case/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendNewAnswerNotification.bind(this), AnswerCreatedEvent.name)
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(answer.questionId.toString())

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question?.authorId.toString(),
        title: `New answer in ${question.title.substring(0, 40).concat('...')}`,
        content: answer.excerpt,
      })
    }
  }
}
