import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '../prisma/prisma.service'

const createAccountBodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User already exists')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
