import { UniqueEntityId } from '@/src/core/entities/unique-entity-id'
import { Attachment } from '@/src/domain/forum/enterprise/entities/attachment'
import { Attachment as PrismaAttachment, Prisma } from '@/src/generated/prisma/client'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        url: raw.url,
        title: raw.title,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      url: attachment.url,
      title: attachment.title,
    }
  }
}
