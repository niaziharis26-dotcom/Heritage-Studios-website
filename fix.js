const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('route.js')) results.push(file);
    }
  });
  return results;
}

const files = [
  'src/app/api/admin/activity/route.js',
  'src/app/api/admin/clients/route.js',
  'src/app/api/admin/cms-data/route.js',
  'src/app/api/admin/footer/route.js',
  'src/app/api/admin/leads/route.js',
  'src/app/api/admin/logout/route.js',
  'src/app/api/admin/media/route.js',
  'src/app/api/admin/navigation/route.js',
  'src/app/api/admin/pages/route.js',
  'src/app/api/admin/projects/route.js',
  'src/app/api/admin/reviews/route.js',
  'src/app/api/admin/revisions/route.js',
  'src/app/api/admin/routes/route.js',
  'src/app/api/admin/settings/route.js',
  'src/app/api/admin/tasks/route.js'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (!content.includes('await db.load()')) {
    content = content.replace(/(export async function \w+\([^)]*\) \{)/g, '$1\n  await db.load();');
    changed = true;
  }
  
  if (content.includes('db.set(') && !content.includes('await db.set(')) {
    content = content.replace(/db\.set\(/g, 'await db.set(');
    changed = true;
  }
  
  if (content.includes('await db.set(') && content.includes('revalidatePath') && !content.includes('db.invalidate()')) {
    content = content.replace(/revalidatePath\('\/', 'layout'\);/g, 'db.invalidate();\n      revalidatePath(\'/\', \'layout\');');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated ' + f);
  }
});
console.log('Done');
