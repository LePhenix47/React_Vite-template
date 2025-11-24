import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Setup readline interface for prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to prompt user
async function prompt(question: string, defaultValue?: string): Promise<string> {
  const defaultText = defaultValue ? ` (default: ${defaultValue})` : '';
  const answer = await rl.question(`${question}${defaultText}: `);
  return answer.trim() || defaultValue || '';
}

// Helper to delete file
function deleteFile(filePath: string): boolean {
  const fullPath = path.join(projectRoot, filePath);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
  } catch (error) {
    console.error(`❌ Failed to delete ${filePath}:`, error);
  }
  return false;
}

// Helper to update JSON file
function updateJSON(filePath: string, updates: Record<string, any>): boolean {
  const fullPath = path.join(projectRoot, filePath);
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const json = JSON.parse(content);

    Object.assign(json, updates);

    fs.writeFileSync(fullPath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Failed to update ${filePath}:`, error);
    return false;
  }
}

// Helper to replace content in file
function replaceInFile(filePath: string, replacements: Array<{find: string | RegExp, replace: string}>): boolean {
  const fullPath = path.join(projectRoot, filePath);
  try {
    let content = fs.readFileSync(fullPath, 'utf-8');

    for (const { find, replace } of replacements) {
      content = content.replace(find, replace);
    }

    fs.writeFileSync(fullPath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Failed to update ${filePath}:`, error);
    return false;
  }
}

// Helper to write entire file
function writeFile(filePath: string, content: string): boolean {
  const fullPath = path.join(projectRoot, filePath);
  try {
    fs.writeFileSync(fullPath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`❌ Failed to write ${filePath}:`, error);
    return false;
  }
}

// Main cleanup function
async function cleanup() {
  console.log('🧹 Template Cleanup Script\n');
  console.log('This will modify your files to remove template-specific content.\n');
  console.log('⚠️  Make sure to review the changes in Git before committing!\n');

  // Gather user input
  const projectName = await prompt('Project name', 'my-react-app');
  const description = await prompt('Description', 'My awesome React application');
  const author = await prompt('Author name', 'Your Name');
  const website = await prompt('Website URL (optional)', 'https://yoursite.com');
  const basePath = await prompt('Deployment base path', '/');

  console.log('\n🔄 Starting cleanup...\n');

  // Track changes
  const deleted: string[] = [];
  const modified: string[] = [];

  // 1. Delete example files
  console.log('📁 Deleting example files...');
  const filesToDelete = [
    'src/routes/about.tsx',
    'src/components/ExampleComponent.tsx',
    'src/stores/exampleStore.ts',
    'src/schemas/exampleSchemas.ts'
  ];

  for (const file of filesToDelete) {
    if (deleteFile(file)) {
      deleted.push(file);
      console.log(`  ✓ Deleted ${file}`);
    }
  }

  // 2. Update package.json
  console.log('\n📦 Updating package.json...');
  if (updateJSON('package.json', {
    name: projectName,
    description: description,
    author: author
  })) {
    modified.push('package.json');
    console.log('  ✓ Updated package.json');
  }

  // 3. Update .env.example
  console.log('\n🔧 Updating .env.example...');
  if (replaceInFile('.env.example', [
    { find: 'VITE_BASE_PATH=/React_Vite-template', replace: `VITE_BASE_PATH=${basePath}` }
  ])) {
    modified.push('.env.example');
    console.log('  ✓ Updated .env.example');
  }

  // 4. Update src/routes/index.tsx
  console.log('\n🏠 Updating home page...');
  const indexContent = `import { createFileRoute } from "@tanstack/react-router";
import { createPortal } from "react-dom";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const HeadContent = (
    <>
      <title>${projectName}</title>
      <meta name="description" content="${description}" />
      <meta property="og:title" content="${projectName}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:url" content="${website}" />
      <meta name="twitter:title" content="${projectName}" />
      <meta name="twitter:description" content="${description}" />
    </>
  );

  return (
    <>
      {createPortal(HeadContent, document.head)}
      <main className="main">
        <section className="section">
          <h1>${projectName}</h1>
          <p>{description}</p>
        </section>
      </main>
    </>
  );
}
`;
  if (writeFile('src/routes/index.tsx', indexContent)) {
    modified.push('src/routes/index.tsx');
    console.log('  ✓ Updated src/routes/index.tsx');
  }

  // 5. Update src/routes/__root.tsx
  console.log('\n🌳 Updating root route...');
  if (replaceInFile('src/routes/__root.tsx', [
    { find: /"React Template"/g, replace: `"${projectName}"` },
    { find: /content="React \+ Vite \+ TypeScript \+ SASS template"/g, replace: `content="${description}"` },
    { find: /content="Younes LAHOUITI"/g, replace: `content="${author}"` },
    { find: /https:\/\/lephenix47\.github\.io/g, replace: website },
    { find: /"React Template - Modern React starter with Vite, TypeScript, and SASS"/g, replace: `"${projectName} - ${description}"` },
    { find: /Made with ❤️ by Younes LAHOUITI/g, replace: `Made with ❤️ by ${author}` }
  ])) {
    modified.push('src/routes/__root.tsx');
    console.log('  ✓ Updated src/routes/__root.tsx');
  }

  // 6. Update .github/workflows/deploy.yml
  console.log('\n🚀 Updating GitHub workflow...');
  if (replaceInFile('.github/workflows/deploy.yml', [
    { find: 'name: Deploy React Vite Template to GitHub Pages', replace: `name: Deploy ${projectName} to GitHub Pages` }
  ])) {
    modified.push('.github/workflows/deploy.yml');
    console.log('  ✓ Updated .github/workflows/deploy.yml');
  }

  // 7. Update README.md
  console.log('\n📝 Updating README.md...');
  const readmeContent = `# ${projectName}

${description}

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **SASS** - Styling
- **TanStack Router** - Routing
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Zod** - Schema validation
- **GSAP** - Animations

## 📦 Installation

\`\`\`bash
bun install
\`\`\`

## 🛠️ Development

\`\`\`bash
bun run dev
\`\`\`

## 🏗️ Build

\`\`\`bash
bun run build
\`\`\`

## 👤 Author

${author}

## 📄 License

ISC
`;
  if (writeFile('README.md', readmeContent)) {
    modified.push('README.md');
    console.log('  ✓ Updated README.md');
  }

  // 8. Remove GitHub Pages redirect code from main.tsx
  console.log('\n🔄 Removing GitHub Pages redirect code...');
  if (replaceInFile('src/main.tsx', [
    {
      find: /\/\/ Handle GitHub Pages 404 redirect\nconst redirect = sessionStorage\.getItem\('redirect'\);\nif \(redirect\) \{\n  sessionStorage\.removeItem\('redirect'\);\n  window\.history\.replaceState\(null, '', redirect\);\n\}\n\n/,
      replace: ''
    }
  ])) {
    modified.push('src/main.tsx');
    console.log('  ✓ Removed redirect code from src/main.tsx');
  }

  // 9. Remove cleanup script from package.json
  console.log('\n🗑️  Removing cleanup script from package.json...');
  const packagePath = path.join(projectRoot, 'package.json');
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  if (packageContent.scripts && packageContent.scripts.cleanup) {
    delete packageContent.scripts.cleanup;
    fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2) + '\n', 'utf-8');
    console.log('  ✓ Removed cleanup script from package.json');
  }

  // 10. Delete this script
  console.log('\n🗑️  Deleting cleanup script...');
  const scriptPath = path.join(projectRoot, 'scripts', 'cleanup-template.ts');
  if (fs.existsSync(scriptPath)) {
    fs.unlinkSync(scriptPath);
    deleted.push('scripts/cleanup-template.ts');
    console.log('  ✓ Deleted scripts/cleanup-template.ts');
  }

  // Summary
  console.log('\n✅ Cleanup complete!\n');
  console.log(`📊 Summary:`);
  console.log(`  - Files deleted: ${deleted.length}`);
  console.log(`  - Files modified: ${modified.length}`);
  console.log('\n📝 Next steps:');
  console.log('  1. Review changes in Git');
  console.log('  2. Update .env with your local development values');
  console.log('  3. Run: bun run dev');
  console.log('\n💡 Tip: You can see all changes by running: git status\n');

  rl.close();
}

cleanup().catch((error) => {
  console.error('\n❌ Cleanup failed:', error);
  rl.close();
  process.exit(1);
});
