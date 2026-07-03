import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/pregnancy")({
  head: () => ({ meta: [{ title: "Pregnancy Care — Luna Flow" }] }),
  component: () => <Outlet />,
});
