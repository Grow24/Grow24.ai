import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transformaltion')({
  component: TransformaltionAliasPage,
})

function TransformaltionAliasPage() {
  return <Navigate to="/transformation" replace />
}

