import { UniqueEntityId } from '@/src/core/entities/unique-entity-id'
import { QuestionDetails } from '@/src/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/src/domain/forum/enterprise/entities/value-objects/slug'
import {
  Attachment as PrismaAttachment,
  Question as PrismaQuestion,
  User as PrismaUser,
} from '@/src/generated/prisma/client'

import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      slug: Slug.create(raw.slug),
      title: raw.title,
      attachments: raw.attachments.map((attachment) => PrismaAttachmentMapper.toDomain(attachment)),
      bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
