import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@src/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@src/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

import { FetchRecentTopicsUseCase } from '@/src/domain/forum/application/use-cases/fetch-recent-topics'

import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionController {
  constructor(private fetchRecentQuestions: FetchRecentTopicsUseCase) {}

  @Get()
  async handle(@Query('page', pageValidationPipe) page: PageParamSchema) {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw new Error()
    }

    const questions = result.value.questions.map((question) => QuestionPresenter.toHTTP(question))

    return { questions }
  }
}
