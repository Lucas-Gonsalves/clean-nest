import { Module } from '@nestjs/common'

import { AnswerQuestionUseCase } from '@/src/domain/forum/application/use-cases/answer-question'
import { AuthenticateStudentUseCase } from '@/src/domain/forum/application/use-cases/authenticate-student'
import { ChooseQuestionBestAnswerUseCase } from '@/src/domain/forum/application/use-cases/choose-question-best-answer'
import { CreateQuestionUseCase } from '@/src/domain/forum/application/use-cases/create-question'
import { DeleteAnswersUseCase } from '@/src/domain/forum/application/use-cases/delete-answer'
import { DeleteQuestionUseCase } from '@/src/domain/forum/application/use-cases/delete-question'
import { EditAnswerUseCase } from '@/src/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/src/domain/forum/application/use-cases/edit-question'
import { FetchQuestionAnswersUseCase } from '@/src/domain/forum/application/use-cases/fetch-question-answers'
import { FetchRecentTopicsUseCase } from '@/src/domain/forum/application/use-cases/fetch-recent-topics'
import { GetQuestionBySlugUseCase } from '@/src/domain/forum/application/use-cases/get-question-by-slug'
import { RegisterStudentUseCase } from '@/src/domain/forum/application/use-cases/register-student'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditQuestionController } from './controllers/edit-question.controller'
import { FetchQuestionAnswersController } from './controllers/fetch-question-answer.controller'
import { FetchRecentQuestionController } from './controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
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
  ],
})
export class HttpModule {}
