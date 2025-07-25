const { execSync } = require('child_process');

console.log('🗄️ Running database migration...');

try {
  // Push the schema to the database
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database migration completed successfully!');
} catch (error) {
  console.error('❌ Database migration failed:', error.message);
  process.exit(1);
}
