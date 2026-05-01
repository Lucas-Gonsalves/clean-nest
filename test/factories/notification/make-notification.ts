import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { Notification, type NotificationProps } from '@src/domain/notification/enterprise/entities/notification'

export function makeNotification(overrride: Partial<NotificationProps> = {}, id?: UniqueEntityId) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...overrride,
    },
    id,
  )

  return notification
}
