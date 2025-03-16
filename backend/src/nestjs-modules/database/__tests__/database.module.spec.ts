import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../config/config.module';
import { DatabaseModule } from '../database.module';

describe.skip('DatabaseModule Unit Tests', () => {
  describe('postgres connection', () => {
    const connOptions = {
      DB_VENDOR: 'postgres',
      DB_HOST: 'localhost',
      DB_DATABASE: 'siseu',
      DB_USERNAME: 'postgres',
      DB_PASSWORD: 'postgres',
      DB_PORT: 5432,
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be a postgres connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connOptions],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const conn = app.get<any>('DATABASE_CONNECTION');
      expect(conn).toBeDefined();
      expect(conn.options.dialect).toBe('postgres');
      expect(conn.options.host).toBe(connOptions.DB_HOST);
      expect(conn.options.database).toBe(connOptions.DB_DATABASE);
      expect(conn.options.username).toBe(connOptions.DB_USERNAME);
      expect(conn.options.password).toBe(connOptions.DB_PASSWORD);
      expect(conn.options.port).toBe(connOptions.DB_PORT);
      await conn.close();
    });
  });
});
