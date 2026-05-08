import { Injectable } from '@nestjs/common'
import { type Either, left, right } from '@src/core/either'
import { NotAllowedError } from '@src/core/errors/domain/not-allowed-error'
import { ResourceNotFoundError } from '@src/core/errors/domain/resource-not-found-error'
import { NotificationsRepository } from '@src/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@src/domain/notification/enterprise/entities/notification'

interface ReadNotificationUseCaseRequest {
  notificationId: string
  recipientId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    notification: Notification
  }
>

Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationRepository.save(notification)

    return right({ notification })
  }
}
