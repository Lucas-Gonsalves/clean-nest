import { WatchedList } from '@src/core/entities/watched-list'
import type { QuestionAttachment } from '@src/domain/forum/enterprise/entities/question-attachment'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
