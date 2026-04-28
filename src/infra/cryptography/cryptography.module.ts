import { Module } from '@nestjs/common'

import { Encrypter } from '@/src/domain/forum/application/cryptography/encrypter'
import { HashComparer } from '@/src/domain/forum/application/cryptography/hash-compare'
import { HashGenerator } from '@/src/domain/forum/application/cryptography/hash-generator'

import { bcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: bcryptHasher },
    { provide: HashGenerator, useClass: bcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
