import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
import { PrismaService } from './prisma.service';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// dotenv.config();

async function bootstrap() {
  try {
    const prismaClientPath = path.join(
      process.cwd(),
      'node_modules/.prisma/client',
    );

    if (!fs.existsSync(prismaClientPath)) {
      execSync('npx prisma generate', { stdio: 'inherit' });
    }

    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.useGlobalPipes(new ValidationPipe());

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);

    await app.listen(3000);
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    process.exit(1);
  }
}
bootstrap();
