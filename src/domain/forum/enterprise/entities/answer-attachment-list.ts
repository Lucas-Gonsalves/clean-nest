import { WatchedList } from '@src/core/entities/watched-list'
import type { AnswerAttachment } from '@src/domain/forum/enterprise/entities/answer-attachment'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
