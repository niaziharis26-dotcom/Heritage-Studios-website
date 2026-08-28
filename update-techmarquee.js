const fs = require('fs');
let code = fs.readFileSync('src/app/(public)/page.js', 'utf8');

const target = `<TechMarquee technologies={components.marqueeTechnologies || [
                'Shopify', 'WordPress', 'React', 'Next.js', 'Meta Ads', 'Google Ads',
                'WooCommerce', 'Elementor', 'Daraz', 'OpenAI', 'Python', 'Mobile Apps',
                'Laravel', 'Node.js', 'Premiere Pro'
              ]} variant="light" />`;

const replacement = `<TechMarquee technologies={components.marqueeTechnologies || [
                'Shopify', 'WordPress', 'React', 'Next.js', 'Meta Ads', 'Google Ads',
                'WooCommerce', 'Elementor', 'Daraz', 'OpenAI', 'Python', 'Mobile Apps',
                'Laravel', 'Node.js', 'Premiere Pro'
              ]} services={services} variant="light" />`;

if(code.includes('components.marqueeTechnologies')) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/app/(public)/page.js', code);
    console.log('page.js updated to pass services to TechMarquee');
}
