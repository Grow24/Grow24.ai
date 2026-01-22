import { RootRoute, Route, RootRouteWithContext, createRouter } from '@tanstack/react-router'
import { RootLayout } from './components/RootLayout'
import { IndexPage } from './routes'
import { SolutionsPage } from './routes/solutions'
import { ResourcesPage } from './routes/resources'

// Root route
const rootRoute = new RootRoute({
  component: RootLayout,
})

// Index page
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})

// Solutions page
const solutionsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/solutions',
  component: SolutionsPage,
})

// Resources page
const resourcesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/resources',
  component: ResourcesPage,
})

// Create route tree
const routeTree = rootRoute.addChildren([indexRoute, solutionsRoute, resourcesRoute])

// Create router
export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default router
