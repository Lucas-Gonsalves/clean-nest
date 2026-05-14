import { SendNotificationUseCase } from '@src/domain/notification/application/use-case/send-notification'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryNotificationsRepository } from '@/test/repositories/forum/in-memory-notification-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'New notification',
      content: 'Notification content',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]?.id).toEqual(result.value?.notification.id)
  })
})
