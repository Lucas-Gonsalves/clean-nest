import { Injectable } from '@nestjs/common'

import { AttachmentsRepository } from '@/src/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/src/domain/forum/enterprise/entities/attachment'

import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment) {
    const data = PrismaAttachmentMapper.toPersistence(attachment)
    await this.prisma.attachment.create({ data })
    return
  }
}
