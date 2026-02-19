// Script to convert Figma tokens JSON to SCSS color variables
const fs = require('fs');
const path = require('path');

// Read the JSON file
const tokensPath = path.join(__dirname, 'enfineitz-figma.tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Function to convert color name to SCSS variable format
function toScssVariableName(path) {
  return '$' + path
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');
}

// Function to recursively extract colors
function extractColors(obj, path = []) {
  let colors = [];
  
  for (const key in obj) {
    const value = obj[key];
    const currentPath = [...path, key];
    
    if (value && typeof value === 'object') {
      if (value.type === 'color' && value.value) {
        // Only include colors with direct hex values (not references)
        if (value.value.startsWith('#')) {
          colors.push({
            name: toScssVariableName(currentPath),
            value: value.value.substring(0, 7), // Remove alpha channel if present
            path: currentPath.join('.')
          });
        }
      } else if (!value.type) {
        // Recursively process nested objects
        colors = colors.concat(extractColors(value, currentPath));
      }
    }
  }
  
  return colors;
}

// Extract all colors from the colors section
const allColors = extractColors(tokens.colors);

// Group colors by category
const grouped = {};
allColors.forEach(color => {
  const category = color.path.split('.')[1] || 'other';
  if (!grouped[category]) {
    grouped[category] = [];
  }
  grouped[category].push(color);
});

// Generate SCSS output
let scssOutput = '// Figma Design Tokens - Colors\n';
scssOutput += '// Auto-generated from enfineitz-figma.tokens.json\n\n';

for (const category in grouped) {
  scssOutput += `// ${category.charAt(0).toUpperCase() + category.slice(1)} Colors\n`;
  grouped[category].forEach(color => {
    scssOutput += `${color.name}: ${color.value};\n`;
  });
  scssOutput += '\n';
}

// Write to a new file
const outputPath = path.join(__dirname, '_colors-figma.scss');
fs.writeFileSync(outputPath, scssOutput, 'utf8');

console.log(`✓ Generated ${allColors.length} color variables in _colors-figma.scss`);
console.log(`✓ Categories: ${Object.keys(grouped).join(', ')}`);
