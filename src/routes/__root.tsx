import { createRootRoute, Outlet } from '@tanstack/react-router'
import RootLayout from '../components/RootLayout'

export const Route = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
})
