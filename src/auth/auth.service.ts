import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';
import { FirebaseSignInResponse } from './dto/firebase-login-response.dto';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const apiKey = this.configService.get<string>('FIREBASE_WEB_API_KEY');

    if (!apiKey) {
      throw new BadRequestException('Configuración de Firebase incompleta');
    }

    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const data = response.data as FirebaseSignInResponse;

      const { idToken, localId, email: returnedEmail, expiresIn } = data;

      return {
        token: idToken,
        user: {
          uid: localId,
          email: returnedEmail,
        },
        expiresIn: Number(expiresIn),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errCode = error.response.data.error.message;

        if (errCode === 'INVALID_LOGIN_CREDENTIALS') {
          throw new UnauthorizedException('Credenciales inválidas');
        }

        throw new UnauthorizedException('Error al iniciar sesión');
      }

      throw new UnauthorizedException('Error inesperado');
    }
  }
}