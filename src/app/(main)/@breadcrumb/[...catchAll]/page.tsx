import { Breadcrumbs } from "@/components/breadcrumbs";

type Props = {
  params: {
    catchAll: string[];
  };
};

export default async function CatchAllBreadcrumbPage({ params }: Props) {
  const { catchAll } = params;
  // Ensure catchAll is always an array, even if the route is like /exists (catchAll = ["exists"])
  const routes = Array.isArray(catchAll) ? catchAll : [catchAll];
  console.log(`Rendering @breadcrumb/[...catchAll]/page.tsx for: ${routes.join("/")}`);
  return <Breadcrumbs routes={routes} />;
}

export async function generateStaticParams() {
  // This function is optional but can be useful for pre-rendering
  // For a repro, we can keep it simple or omit it.
  // Example: return [{ catchAll: ['exists'] }];
  return [];
}
