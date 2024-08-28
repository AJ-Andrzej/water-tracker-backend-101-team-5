import 'dotenv/config';

export function env(data, defaultValue) {
  const value = process.env[data];

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${data}'].`);
}
