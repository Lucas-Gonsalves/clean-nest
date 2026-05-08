import { Module } from '@nestjs/common'

import { OnAnswerCreated } from '@/src/domain/notification/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerChoosen } from '@/src/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { SendNotificationUseCase } from '@/src/domain/notification/application/use-case/send-notification'

import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [OnAnswerCreated, OnQuestionBestAnswerChoosen, SendNotificationUseCase],
})
export class EventsModule {}
