/**
 * Configuração PostgreSQL
 */
export function postgresConfig() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pg = require('pg');

  // Força conversão de valores numéricos em string para number
  // Fonte: https://github.com/typeorm/typeorm/issues/289#issuecomment-285794123
  pg.types.setTypeParser(1700, (v: any) => parseFloat(v));
}
