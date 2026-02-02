import { RootRoute, Route, RootRouteWithContext, createRouter } from '@tanstack/react-router'
import { RootLayout } from './components/RootLayout'
import { IndexPage } from './routes'
import { SolutionsPage } from './routes/solutions'
import { ResourcesPage } from './routes/resources'
import LibraryPageComponent from './routes/library'
import WhatWeOfferPage from './routes/what-we-offer'

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

// Library page
const libraryRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/library',
  component: LibraryPageComponent,
})

// Our offerings page
const whatWeOfferRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/what-we-offer',
  component: WhatWeOfferPage,
})

// Create route tree
const routeTree = rootRoute.addChildren([indexRoute, solutionsRoute, resourcesRoute, libraryRoute, whatWeOfferRoute])

// Create router
export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default router
