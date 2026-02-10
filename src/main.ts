import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS completo y permisivo para desarrollo
  app.enableCors({
    origin: [
      'http://localhost:19000',     // Expo dev tools
      'http://localhost:8081',     // Expo Go web/simulador
      'exp://*',                    // Expo Go en celular
      'http://*',                   // cualquier IP local
      'https://*',                  // por si acaso
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();