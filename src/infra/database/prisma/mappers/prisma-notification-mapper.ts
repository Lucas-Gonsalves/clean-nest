import { UniqueEntityId } from '@/src/core/entities/unique-entity-id'
import { Notification } from '@/src/domain/notification/enterprise/entities/notification'
import { Notification as PrismaNotification, Prisma } from '@/src/generated/prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(notification: Notification): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      readAt: notification.readAt,
      recipientId: notification.recipientId.toString(),
      createdAt: notification.createdAt,
    }
  }
}
