import { Pool } from 'pg';

const pool = new Pool({
  /*
  user: 'adter01',
  password: 'nn32BrziGP6wyLXBLmgRSOrlmfPV0O5v',
  */
  connectionString: 'postgres://adter01:nn32BrziGP6wyLXBLmgRSOrlmfPV0O5v@dpg-chh57gbhp8u065v23l4g-a.oregon-postgres.render.com/terniumtalentdb',
  ssl: {
    rejectUnauthorized: false
  }
  /*
  port: 5432,
  database: 'terniumtalentdb',
  */
});

export default pool;
