import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common'
import z from 'zod'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '../prisma/prisma.service'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', pageValidationPipe) page: PageParamSchema) {
    const perPage = 1

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
