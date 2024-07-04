const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const configPath = process.argv[2];

if (!configPath) {
  console.error('Please provide a path to the configuration file.');
  process.exit(1);
}

let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error('Failed to read or parse the configuration file:', error);
  process.exit(1);
}

const { projectName, port, host } = config;

if (!projectName || !port || !host) {
  console.error('Invalid configuration. Please provide projectName, port, and host.');
  process.exit(1);
}

const runCommand = (command, errorMessage) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(errorMessage, error);
    process.exit(1);
  }
};

// Step 1: Initialize a new Vite project
console.log('Initializing a new Vite project...');
runCommand(`npm create vite@latest ${projectName} -- --template vanilla`, 'Failed to initialize Vite project.');

process.chdir(projectName);

// Step 2: Install project dependencies
console.log('Installing project dependencies...');
runCommand('npm install', 'Failed to install project dependencies.');

// Step 3: Install Bootstrap, Tailwind CSS, PostCSS, and Autoprefixer
console.log('Installing Bootstrap, Tailwind CSS, PostCSS, and Autoprefixer...');
runCommand('npm install bootstrap tailwindcss postcss autoprefixer', 'Failed to install Bootstrap, Tailwind CSS, PostCSS, and Autoprefixer.');

// Step 4: Initialize Tailwind CSS configuration
console.log('Initializing Tailwind CSS configuration...');
runCommand('npx tailwindcss init -p', 'Failed to initialize Tailwind CSS configuration.');

// Step 5: Configure Tailwind CSS
console.log('Configuring Tailwind CSS...');
const tailwindConfig = `module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
fs.writeFileSync('tailwind.config.js', tailwindConfig);

// Step 6: Update PostCSS configuration
console.log('Configuring PostCSS...');
const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
fs.writeFileSync('postcss.config.cjs', postcssConfig);

// Step 7: Create the default project directory structure
console.log('Creating default project directory structure...');
const directories = ['src/assets/images', 'src/assets/styles', 'src/components', 'src/views'];
directories.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
const files = [
  'src/assets/styles/_variables.scss',
  'src/assets/styles/_mixins.scss',
  'src/assets/styles/main.scss',
  'src/components/ExampleComponent.js',
  'src/views/Home.js'
];
files.forEach(file => fs.writeFileSync(file, ''));

// Step 8: Create main.js and style.css
console.log('Setting up project entry files...');
const mainJsContent = `import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';`;
fs.writeFileSync('src/main.js', mainJsContent);

const styleCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
fs.writeFileSync('src/style.css', styleCssContent);

// Step 9: Update index.html
console.log('Updating index.html...');
const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
</head>
<body>
  <div id="app">
    <p>Project Name: ${projectName}</p>
    <p>Host: ${host}</p>
    <p>Port: ${port}</p>
  </div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`;
fs.writeFileSync('index.html', indexHtmlContent);

// Step 10: Update package.json to set up the Vite server configuration
console.log('Configuring Vite server...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.scripts.dev = `vite --host ${host} --port ${port}`;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Project setup completed successfully.');
console.log('Next steps:');
console.log(`1. Navigate to the project directory: cd ${projectName}`);
console.log('2. Start the development server: npm run dev');
console.log('3. Open the project in your browser and start developing!');

