import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config'; // para usar .env si lo necesitas

@Module({
  imports: [ConfigModule], // opcional pero útil para ConfigService
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // si algún día otro módulo necesita usarlo
})
export class AuthModule {}