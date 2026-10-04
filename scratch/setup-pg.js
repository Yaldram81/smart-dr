const { execSync } = require('child_process');

try {
  console.log('Testing PostgreSQL connection and creating database smart_dr if not exists...');
  const psqlPath = 'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe';
  
  // Use pgpass or connection string format
  const connStr = 'postgresql://postgres:12345678@localhost:5432/postgres';
  const checkCmd = `"${psqlPath}" "${connStr}" -tAc "SELECT 1 FROM pg_database WHERE datname = 'smart_dr'"`;
  const result = execSync(checkCmd, { encoding: 'utf-8' }).trim();
  
  if (result === '1') {
    console.log('Database smart_dr already exists.');
  } else {
    console.log('Database smart_dr does not exist. Creating...');
    const createCmd = `"${psqlPath}" "${connStr}" -c "CREATE DATABASE smart_dr;"`;
    execSync(createCmd, { stdio: 'inherit' });
    console.log('Database smart_dr created successfully.');
  }
} catch (error) {
  console.error('Error setting up database:', error.message);
  process.exit(1);
}
