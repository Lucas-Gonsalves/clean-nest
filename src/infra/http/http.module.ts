import { Module } from '@nestjs/common'

import { AnswerQuestionUseCase } from '@/src/domain/forum/application/use-cases/answer-question'
import { AuthenticateStudentUseCase } from '@/src/domain/forum/application/use-cases/authenticate-student'
import { ChooseQuestionBestAnswerUseCase } from '@/src/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnAnswerUseCase } from '@/src/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestionUseCase } from '@/src/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestionUseCase } from '@/src/domain/forum/application/use-cases/create-question'
import { DeleteAnswersUseCase } from '@/src/domain/forum/application/use-cases/delete-answer'
import { DeleteAnswerCommentUseCase } from '@/src/domain/forum/application/use-cases/delete-answer-comment'
import { DeleteQuestionUseCase } from '@/src/domain/forum/application/use-cases/delete-question'
import { DeleteQuestionCommentUseCase } from '@/src/domain/forum/application/use-cases/delete-question-comment'
import { EditAnswerUseCase } from '@/src/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/src/domain/forum/application/use-cases/edit-question'
import { FetchAnswerCommentsUseCase } from '@/src/domain/forum/application/use-cases/fetch-answer-comments'
import { FetchQuestionAnswersUseCase } from '@/src/domain/forum/application/use-cases/fetch-question-answers'
import { FetchQuestionCommentsUseCase } from '@/src/domain/forum/application/use-cases/fetch-question-comments'
import { FetchRecentTopicsUseCase } from '@/src/domain/forum/application/use-cases/fetch-recent-topics'
import { GetQuestionBySlugUseCase } from '@/src/domain/forum/application/use-cases/get-question-by-slug'
import { RegisterStudentUseCase } from '@/src/domain/forum/application/use-cases/register-student'
import { UploadAndCreateAttachmentUseCase } from '@/src/domain/forum/application/use-cases/upload-and-create-attachment'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller'
import { CommentOnQuestionController } from './controllers/comment-on-question.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditQuestionController } from './controllers/edit-question.controller'
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller'
import { FetchQuestionAnswersController } from './controllers/fetch-question-answer.controller'
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller'
import { FetchRecentQuestionController } from './controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { UpdloadAttachmentController } from './controllers/upload-attachment.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UpdloadAttachmentController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentTopicsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswersUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
