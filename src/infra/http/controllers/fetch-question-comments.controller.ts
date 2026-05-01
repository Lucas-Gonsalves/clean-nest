import { BadRequestException, Body, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@src/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

import { FetchQuestionCommentsUseCase } from '@/src/domain/forum/application/use-cases/fetch-question-comments'

import { QuestionCommentPresenter } from '../presenters/question-comment-presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionCommentss: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(@Query('page', pageValidationPipe) page: PageParamSchema, @Param('questionId') questionId: string) {
    const result = await this.fetchQuestionCommentss.execute({ questionId, page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value.questionComments.map((questionComment) =>
      QuestionCommentPresenter.toHTTP(questionComment),
    )

    return { questions }
  }
}
