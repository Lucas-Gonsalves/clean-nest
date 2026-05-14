import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { NotAllowedError } from '@src/core/errors/domain/not-allowed-error'
import { ReadNotificationUseCase } from '@src/domain/notification/application/use-case/read-notification'
import { beforeEach, describe, expect, it } from 'vitest'

import { makeNotification } from '@/test/factories/forum/make-notification'
import { InMemoryNotificationsRepository } from '@/test/repositories/forum/in-memory-notification-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]?.readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'wrong-recipient-id',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryNotificationsRepository.items[0]?.readAt).not.toEqual(expect.any(Date))
  })
})
