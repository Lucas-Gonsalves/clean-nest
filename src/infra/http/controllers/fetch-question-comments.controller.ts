import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@src/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

import { FetchQuestionCommentsUseCase } from '@/src/domain/forum/application/use-cases/fetch-question-comments'

import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(@Query('page', pageValidationPipe) page: PageParamSchema, @Param('questionId') questionId: string) {
    const result = await this.fetchQuestionComments.execute({ questionId, page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const comments = result.value.comments.map((questionComment) => CommentWithAuthorPresenter.toHTTP(questionComment))

    return { comments }
  }
}
