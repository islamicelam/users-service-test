import "dotenv/config";

interface EnvConfig {
  nodeEnv: string;
  port: number;
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  bcrypt: {
    saltRounds: number;
  };
}

function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return defaultValue;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return parsed;
}

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: getEnvNumber("PORT", 3000),
  db: {
    host: process.env.DB_HOST!,
    port: getEnvNumber("DB_PORT"),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  },
  bcrypt: {
    saltRounds: getEnvNumber("BCRYPT_SALT_ROUNDS", 10),
  },
};
