import { Module } from '@nestjs/common'

import { AuthenticateStudentUseCase } from '@/src/domain/forum/application/use-cases/authenticate-student'
import { CreateQuestionUseCase } from '@/src/domain/forum/application/use-cases/create-question'
import { FetchRecentTopicsUseCase } from '@/src/domain/forum/application/use-cases/fetch-recent-topics'
import { RegisterStudentUseCase } from '@/src/domain/forum/application/use-cases/register-student'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionController } from './controllers/fetch-recent-questions.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionController,
  ],
  providers: [CreateQuestionUseCase, FetchRecentTopicsUseCase, RegisterStudentUseCase, AuthenticateStudentUseCase],
})
export class HttpModule {}
