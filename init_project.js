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

const { projectName, port, host, githubUsername } = config;

if (!projectName || !port || !host || !githubUsername) {
  console.error('Invalid configuration. Please provide projectName, port, host, and githubUsername.');
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

// Step 10: Create vite.config.js with the base URL
console.log('Creating vite.config.js...');
const viteConfigContent = `import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  server: {
    host: '${host}',
    port: ${port},
  },
  build: {
    outDir: 'dist'
  }
});`;
fs.writeFileSync('vite.config.js', viteConfigContent);

// Step 11: Update package.json to set up the Vite server configuration
console.log('Configuring Vite server...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.scripts.dev = `vite --host ${host} --port ${port}`;
packageJson.scripts.build = 'vite build';
packageJson.scripts.deploy = 'gh-pages -d dist';
packageJson.homepage = `https://${githubUsername}.github.io/`;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Step 12: Install gh-pages
console.log('Installing gh-pages...');
runCommand('npm install gh-pages --save-dev', 'Failed to install gh-pages.');

// Step 13: Create GitHub Actions workflow for deployment
console.log('Creating GitHub Actions workflow...');
const workflowDir = path.join(process.cwd(), '.github', 'workflows');
fs.mkdirSync(workflowDir, { recursive: true });
const workflowContent = `# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['main']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload dist folder
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;
fs.writeFileSync(path.join(workflowDir, 'deploy.yml'), workflowContent);

console.log('Project setup completed successfully.');
console.log('Next steps:');
console.log(`1. Navigate to the project directory: cd ${projectName}`);
console.log('2. Start the development server: npm run dev');
console.log('3. Build the project for production: npm run build');
console.log('4. Deploy the project to GitHub Pages: npm run deploy');
console.log('5. Open the project in your browser and start developing!');
