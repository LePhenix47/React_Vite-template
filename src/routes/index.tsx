import { createFileRoute } from '@tanstack/react-router';
import { ExampleComponent } from '@/components/ExampleComponent';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div>
      <ThemeToggle />

      <h2>Welcome to React + Vite + TypeScript Template</h2>
      <p>Your app is ready to go with:</p>
      <ul>
        <li>TanStack Router - File-based routing</li>
        <li>TanStack Query - Data fetching & caching</li>
        <li>Zustand - State management</li>
        <li>Zod - Schema validation</li>
        <li>GSAP - Animations</li>
        <li>SASS - Styling</li>
        <li>Theme Switching - Light/Dark/System modes</li>
      </ul>

      <ExampleComponent />
    </div>
  );
}
