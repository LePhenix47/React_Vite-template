import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
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
