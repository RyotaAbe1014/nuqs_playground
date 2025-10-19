import { createRootRoute, Outlet } from '@tanstack/react-router'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import '../App.css'

const RootLayout = () => (
  <>
    <NuqsAdapter>
      <Outlet />
    </NuqsAdapter>
  </>
)

export const Route = createRootRoute({ component: RootLayout })