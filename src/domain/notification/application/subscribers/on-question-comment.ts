import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { QuestionCommentEvent } from '@/domain/forum/enterprise/events/question-comment-event'
import type { SendNotificationUseCase } from '@/domain/notification/application/use-case/send-notification'

export class OnQuestionComment implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendQuestionNotification.bind(this), QuestionCommentEvent.name)
  }

  private async sendQuestionNotification({ questionComment }: QuestionCommentEvent) {
    const question = await this.questionsRepository.findById(questionComment.questionId.toString())

    if (!question) {
      return
    }

    await this.sendNotificationUseCase.execute({
      recipientId: question?.authorId.toString(),
      title: 'Someone commented on your question!',
      content: `New comment on your question: ${questionComment.content.substring(0, 20).concat('...')}`,
    })
  }
}
