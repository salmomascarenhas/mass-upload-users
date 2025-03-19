import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Entity } from '../../../../core/shared/domain/entity';
import { NotFoundEntityError } from '../../../../core/shared/domain/errors/not-found-entity.error';
import { NotFoundEntityErrorFilter } from '../not-found-error.filter';

class StubEntity extends Entity {
  entity_id: any;
  toJSON(): Required<any> {
    return {};
  }
}

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundEntityError('fake id', StubEntity);
  }
}

describe('NotFoundEntityErrorFilter Unit Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new NotFoundEntityErrorFilter());
    await app.init();
  });

  it.skip('should catch a EntityValidationError', () => {
    return request(app.getHttpServer()).get('/stub').expect(404).expect({
      statusCode: 404,
      error: 'Not Found',
      message: 'StubEntity Not Found using ID fake id',
    });
  });
});
