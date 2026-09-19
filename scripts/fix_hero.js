const fs = require('fs');
const path = require('path');

const heroFile = path.join(__dirname, '..', 'src', 'components', 'home', 'HeroSection.jsx');
let content = fs.readFileSync(heroFile, 'utf8');

// The line contains the exact text - replace it
content = content.replace(
  /Consultant Cardiologist[^<]*Apex Heart[^<]*/g,
  'Orthopaedic Surgeon \u2022 Joint Replacement &amp; Sports Medicine'
);

fs.writeFileSync(heroFile, content, 'utf8');
console.log('Done. Checking result:');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('Orthopaedic Surgeon') || l.includes('Cardiologist')) {
    console.log(`Line ${i + 1}: ${l}`);
  }
});
