import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Health Check',
    description: 'Rota para verificar o status da API',
  })
  @Get()
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
