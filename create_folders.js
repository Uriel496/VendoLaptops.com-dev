const fs = require('fs');
const path = require('path');

const basePath = 'C:\\Users\\ibarr\\vendolaptops.com\\src';
const directories = [
  'components/ui',
  'components/layout',
  'features/products',
  'features/cart',
  'features/auth',
  'hooks',
  'services',
  'context',
  'routes',
  'pages',
  'utils'
];

directories.forEach(dir => {
  const fullPath = path.join(basePath, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`Created: ${fullPath}`);
});

console.log('\n✓ All directories created successfully!');
