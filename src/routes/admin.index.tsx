import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: () => <Navigate to="/admin/dashboard" replace />,
});