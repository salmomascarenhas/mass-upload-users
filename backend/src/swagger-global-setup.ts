import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerGlobalSetup {
  public static apply(app: INestApplication) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Mass Upload API')
      .setDescription('Documentação Mass Upload API.')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('api', app, swaggerDocument);
  }
}
