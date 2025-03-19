import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerGlobalSetup {
  public static apply(app: INestApplication) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Mass Upload API')
      .setDescription('Documentação da API de upload de arquivos em massa.')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('docs', app, swaggerDocument);
  }
}
