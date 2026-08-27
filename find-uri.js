const fs = require('fs');
try {
  const db = JSON.parse(fs.readFileSync('database.json', 'utf8'));
  const keys = Object.keys(db);
  console.log('database.json top-level keys:', keys.join(', '));
} catch(e) { 
  console.log('No database.json:', e.message); 
}

// Check for .env files
const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
envFiles.forEach(f => {
  try {
    const content = fs.readFileSync(f, 'utf8');
    const hasUri = content.includes('MONGODB_URI');
    console.log(f + ':', hasUri ? 'HAS MONGODB_URI' : 'no MONGODB_URI');
    if (hasUri) {
      const line = content.split('\n').find(l => l.includes('MONGODB_URI'));
      console.log('  Line:', line ? line.substring(0, 60) : 'not found');
    }
  } catch(e) {
    // file doesn't exist
  }
});

// Check old db.js in git for any hardcoded URI
try {
  const gitLog = require('child_process').execSync('git show HEAD~4:src/lib/db.js').toString();
  if (gitLog.includes('mongodb+srv')) {
    const idx = gitLog.indexOf('mongodb+srv');
    console.log('Found URI in old git history:', gitLog.substring(idx, idx + 80));
  } else {
    console.log('No hardcoded URI in old db.js git history');
  }
} catch(e) {
  console.log('Git check error:', e.message);
}
