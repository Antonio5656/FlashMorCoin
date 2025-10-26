const { exec } = require('child_process');

console.log('🔍 Probando Next.js...');

exec('npx next dev --port 3001', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Error:', error.message);
    console.log('stderr:', stderr);
    return;
  }
  console.log('✅ Next.js funcionando:', stdout);
});