import { Pool } from 'pg';

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_X5gewhHCnV7P@ep-old-frog-a8g581ql.eastus2.azure.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;