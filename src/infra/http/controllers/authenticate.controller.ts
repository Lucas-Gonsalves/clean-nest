import { BadRequestException, Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '@src/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

import { AuthenticateStudentUseCase } from '@/src/domain/forum/application/use-cases/authenticate-student'
import { WrongCredentialsError } from '@/src/domain/forum/application/use-cases/errors/wrong-credentials-error'

import { Public } from '../../auth/public'

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
