import { BadRequestException, Body, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@src/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

import { FetchQuestionAnswersUseCase } from '@/src/domain/forum/application/use-cases/fetch-question-answers'

import { AnswerPresenter } from '../presenters/answer-presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(@Query('page', pageValidationPipe) page: PageParamSchema, @Param('questionId') questionId: string) {
    const result = await this.fetchQuestionAnswers.execute({ questionId, page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answers = result.value.answers.map((answer) => AnswerPresenter.toHTTP(answer))

    return { answers }
  }
}
