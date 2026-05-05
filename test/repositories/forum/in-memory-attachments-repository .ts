import type { AttachmentsRepository } from '@src/domain/forum/application/repositories/attachments-repository'
import type { Attachment } from '@src/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachments: Attachment) {
    this.items.push(attachments)
  }
}
