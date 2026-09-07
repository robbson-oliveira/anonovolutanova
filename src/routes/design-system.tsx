import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/design-system")({
  component: () => <Outlet />,
});
