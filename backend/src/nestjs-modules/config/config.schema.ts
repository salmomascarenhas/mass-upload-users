import * as Joi from 'joi';

export type NODE_SCHEMA_TYPE = {
  NODE_ENV: 'dev' | 'prod' | 'test' | 'e2e';
};

export type DB_SCHEMA_TYPE = {
  DB_VENDOR: 'postgres';
  DB_HOST: string;
  DB_DATABASE: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_DROPSCHEMA: boolean;
  DB_SYNCHRONIZE: boolean;
  DB_LOGGING: boolean;
  DB_MIGRATIONS: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
  DB_SCHEMA: string;
  DATABASE_URL: string;
};

export type SERVER_SCHEMA_TYPE = {
  SERVER_PORT: number;
  SERVER_HOSTNAME: string;
  SERVER_CORS_ORIGIN: string;
  TZ: string;
};

export type REDIS_SCHEMA_TYPE = {
  REDIS_HOSTNAME: string;
  REDIS_PORT: number;
};

// Schemas
export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().valid('postgres').required(),
  DB_MIGRATIONS: Joi.boolean().optional(),
  DB_HOST: Joi.string().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_PORT: Joi.number().integer().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_DROPSCHEMA: Joi.boolean().optional(),
  DB_SYNCHRONIZE: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
  DB_LOGGING: Joi.boolean().required(),
  DB_SCHEMA: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
};

export const CONFIG_NODE_SCHEMA: Joi.StrictSchemaMap<NODE_SCHEMA_TYPE> = {
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test', 'e2e').default('dev'),
};

export const CONFIG_SERVER_SCHEMA: Joi.StrictSchemaMap<SERVER_SCHEMA_TYPE> = {
  SERVER_HOSTNAME: Joi.string().when('NODE_ENV', {
    is: Joi.valid('prod'),
    then: Joi.string().required(),
    otherwise: Joi.string().default('localhost'),
  }),
  SERVER_PORT: Joi.number().default(3000),
  SERVER_CORS_ORIGIN: Joi.string().when('NODE_ENV', {
    is: Joi.valid('prod'),
    then: Joi.string().required(),
    otherwise: Joi.string().default('http://localhost:8080'),
  }),
  TZ: Joi.string().default('America/Fortaleza'),
};

export const CONFIG_REDIS_SCHEMA: Joi.StrictSchemaMap<REDIS_SCHEMA_TYPE> = {
  REDIS_HOSTNAME: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
};

export const CONFIG_SCHEMA = Joi.object({
  ...CONFIG_DB_SCHEMA,
  ...CONFIG_NODE_SCHEMA,
  ...CONFIG_SERVER_SCHEMA,
  ...CONFIG_REDIS_SCHEMA,
});

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE &
  NODE_SCHEMA_TYPE &
  SERVER_SCHEMA_TYPE &
  REDIS_SCHEMA_TYPE;
