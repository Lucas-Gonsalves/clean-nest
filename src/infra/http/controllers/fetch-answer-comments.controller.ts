import { BadRequestException, Body, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@src/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

import { FetchAnswerCommentsUseCase } from '@/src/domain/forum/application/use-cases/fetch-answer-comments'

import { AnswerCommentPresenter } from '../presenters/answer-comment-presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentss: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(@Query('page', pageValidationPipe) page: PageParamSchema, @Param('answerId') answerId: string) {
    const result = await this.fetchAnswerCommentss.execute({ answerId, page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answers = result.value.answerComments.map((answerComment) => AnswerCommentPresenter.toHTTP(answerComment))

    return { answers }
  }
}
