import { Module } from '@nestjs/common'
import { AuthModule } from '@src/infra/auth/auth.module'

import { EnvModule } from '@/src/infra/env/env.module'

import { EventsModule } from './events/events.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [EnvModule, AuthModule, HttpModule, EventsModule],
})
export class AppModule {}
