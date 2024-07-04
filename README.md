# Vite Bootstrap Tailwind Setup

A Node.js script to automate the initialization and configuration of a Vite project with Bootstrap, Tailwind CSS, PostCSS, and Autoprefixer. The project settings are configurable via a JSON file.

## Features

- Initializes a new Vite project.
- Installs Bootstrap, Tailwind CSS, PostCSS, and Autoprefixer.
- Sets up the project directory structure.
- Configures Vite server settings (host and port) from a JSON configuration file.
- Displays project configuration details in the default `index.html`.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12 or later)
- [npm](https://www.npmjs.com/)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/eclipse-consulting/vite-bootstrap-tailwind-setup.git
cd vite-bootstrap-tailwind-setup
```

### 2. Install Dependencies

```
sh
Copy code
npm install
```

### 3. Create a Configuration File

Create a `config.json` file with the following structure:

```
json
Copy code
{
  "projectName": "my-project",
  "port": 5173,
  "host": "localhost"
}
```

### 4. Run the Script

```
sh
Copy code
node init_project.js path/to/config.json
```

### 5. Navigate to Your Project

```
sh
Copy code
cd my-project
```

### 6. Start the Development Server

```
sh
Copy code
npm run dev
```

### 7. Open the Project in Your Browser

Visit `http://localhost:5173` (or the configured host and port) to see your project.

## Directory Structure

The script sets up the following directory structure:

```
arduino
Copy code
my-project/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       ├── _variables.scss
│   │       ├── _mixins.scss
│   │       └── main.scss
│   ├── components/
│   │   └── ExampleComponent.js
│   ├── views/
│   │   └── Home.js
│   ├── main.js
│   └── style.css
├── .gitignore
├── package.json
├── postcss.config.cjs
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Author

- EclipseConsulting.ai

## Acknowledgements

- Inspired by the need for a quick setup of Vite projects with modern CSS frameworks.

```
bash
Copy code

### Additional Files

- **.gitignore**: Add typical Node.js project ignores.

```gitignore
# Node modules
node_modules/

# Logs
logs
*.log
npm-debug.log*

# Dependency directories
jspm_packages/
```

