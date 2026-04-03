import { createFileRoute } from '@tanstack/react-router'
import ToolsetsPage from './toolsets'

export const Route = createFileRoute('/Skills')({
  component: ToolsetsPage,
})

