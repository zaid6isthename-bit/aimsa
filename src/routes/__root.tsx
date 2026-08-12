import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { RouteTransition } from "@/components/motion/RouteTransition";
import { GridHorizon } from "@/components/motion/GridHorizon";
import { Preloader } from "@/components/motion/Preloader";
import { EasterEgg } from "@/components/motion/EasterEgg";
import { SpotlightProvider } from "@/components/motion/SpotlightProvider";
import { getSiteContent } from "@/lib/cms/public-content.functions";
import { emptySiteContent } from "@/lib/cms/content-types";
import { setSiteContent } from "@/lib/cms/store";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-background px-4">
      <GridHorizon />
      <div className="relative max-w-md text-center">
        <h1 className="text-chrome text-8xl font-extrabold tracking-tight sm:text-9xl">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Signal lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This route isn't on the grid. It may have been moved, renamed, or never existed.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to home
          </Link>
          <Link
            to="/events"
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Browse events
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => {
    try {
      return await getSiteContent();
    } catch {
      // Transient network/server hiccup: fall back to built-in seed content
      // instead of blanking the whole app.
      return emptySiteContent;
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "AIMSA — AI & ML Students Association, LTCE Navi Mumbai",
      },
      {
        name: "description",
        content:
          "AIMSA is LTCE's student-led AI and machine learning community in Navi Mumbai. Think Beyond. Build Ahead.",
      },
      { name: "author", content: "AIMSA, Lokmanya Tilak College of Engineering" },
      { property: "og:site_name", content: "AIMSA — LTCE" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://fonts.cdnfonts.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@500;600&family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.cdnfonts.com/css/pricedown",
      },

    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const content = Route.useLoaderData();
  setSiteContent(content);
  const isAdmin = useRouterState({
    select: (s) => s.location.pathname.startsWith("/admin"),
  });

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <SpotlightProvider>
        <main id="main">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer />
      </SpotlightProvider>
      <Toaster />
      <SmoothScroll />
      <ScrollProgress />
      <RouteTransition />
      <CustomCursor />
      <EasterEgg />
      <Preloader />
    </QueryClientProvider>
  );
}
