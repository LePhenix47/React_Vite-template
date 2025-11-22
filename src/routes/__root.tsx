import { useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useAppStore } from '@/stores/useAppStore';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // Theme logic - ONLY place where theme class is applied
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const abortController = new AbortController();

    const applyTheme = (currentTheme: 'light' | 'dark' | 'system') => {
      const isDark =
        currentTheme === 'dark' ||
        (currentTheme === 'system' && mediaQuery.matches);
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
    };

    // Apply theme immediately
    applyTheme(theme);

    // Listen for OS theme changes when in system mode
    const handleChange = () => {
      if (theme !== 'system') {
        return;
      }
      applyTheme(theme);
    };

    mediaQuery.addEventListener('change', handleChange, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [theme]);

  return (
    <>
      <header className="header" data-element="header">
        <svg className="hide header__svg-filters"></svg>
        <h1 className="header__title" title="Title">Chess</h1>
      </header>

      <main className="index" data-element="index">
        <Outlet />
      </main>

      <footer className="footer" data-element="footer">
        <p className="footer__paragraph">
          Made by:{' '}
          <a
            href="https://younes-portfolio-dev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Younes Lahouiti
          </a>
        </p>
      </footer>

      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
