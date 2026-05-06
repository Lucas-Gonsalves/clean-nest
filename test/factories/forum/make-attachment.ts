import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@src/core/entities/unique-entity-id'
import { Attachment, type AttachmentProps } from '@src/domain/forum/enterprise/entities/attachment'

import { PrismaAttachmentMapper } from '@/src/infra/database/prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '@/src/infra/database/prisma/prisma.service'

export function makeAttachment(overrride: Partial<AttachmentProps> = {}, id?: UniqueEntityId) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...overrride,
    },
    id,
  )

  return attachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
    const attachment = makeAttachment(data)

    await this.prisma.attachment.create({ data: PrismaAttachmentMapper.toPersistence(attachment) })

    return attachment
  }
}
