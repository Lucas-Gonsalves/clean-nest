import { BadRequestException, Controller, HttpCode, Param, Patch } from '@nestjs/common'

import { ReadNotificationUseCase } from '@/src/domain/notification/application/use-case/read-notification'

import { CurrentUser } from '../../auth/current-user.decorator'
import type { UserPayload } from '../../auth/jwt.strategy'

@Controller('/notification/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('notificationId') notificationId: string, @CurrentUser() user: UserPayload) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
