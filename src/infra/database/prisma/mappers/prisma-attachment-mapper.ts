import { Attachment } from '@/src/domain/forum/enterprise/entities/attachment'
import { Prisma } from '@/src/generated/prisma/client'

export class PrismaAttachmentMapper {
  static toPersistence(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      url: attachment.url,
      title: attachment.title,
    }
  }
}
